import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PageFile } from '@/content/types';
import { buildUnits, type Unit } from './units';

/**
 * The page is long (the longest has about 1.4 MB of pre-rendered formulas), so its parts (units)
 * are mounted in three ways, all cheap for the first load:
 * - the first few at once, so the hero and the first section are there on the first paint;
 * - the others when their placeholder comes within about two screens of the window (`demand`);
 * - whatever is left, a few at a time in idle moments, starting a few seconds after the page
 *   opened, so scrolling later finds everything ready.
 * `mountAll` (used by a jump to a section that may still be a placeholder) mounts everything at
 * once. Without IntersectionObserver (old browsers, tests) everything is mounted at once.
 */
export const FIRST_UNITS = 2;
export const UNITS_PER_STEP = 3;
/** Once the reader reaches for the contents, the rest is mounted at once-ish: no wait, bigger steps. */
export const WARM_UNITS_PER_STEP = 8;
export const BACKGROUND_DELAY_MS = 3000;
const NEAR_MARGIN = '1200px 0px';

const staged = () => typeof IntersectionObserver === 'function';

function useUnitLimit(total: number, mountAll: boolean, warm: boolean) {
  const [limit, setLimit] = useState(() => (staged() ? FIRST_UNITS : total));
  const openedAt = useRef<number | null>(null);

  const demand = useCallback((index: number) => {
    setLimit((l) => Math.max(l, index + 2));
  }, []);

  useEffect(() => {
    if (mountAll || limit >= total) return;
    openedAt.current ??= performance.now();
    const wait = warm
      ? 0
      : Math.max(0, BACKGROUND_DELAY_MS - (performance.now() - openedAt.current));
    const step = warm ? WARM_UNITS_PER_STEP : UNITS_PER_STEP;
    const next = () => setLimit((l) => l + step);
    let idle = 0;
    const timer = window.setTimeout(() => {
      if (typeof requestIdleCallback === 'function')
        idle = requestIdleCallback(next, { timeout: 1000 });
      else next();
    }, wait);
    return () => {
      window.clearTimeout(timer);
      if (idle && typeof cancelIdleCallback === 'function') cancelIdleCallback(idle);
    };
  }, [limit, total, mountAll, warm]);

  return { limit: mountAll ? total : limit, demand };
}

type PlaceholderProps = { unit: Unit; index: number; onNear: (index: number) => void };

/** Holds the place (and the id) of a unit that is not mounted yet, and asks for it when it is near. */
const Placeholder = memo(function Placeholder({ unit, index, onNear }: PlaceholderProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !staged()) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) onNear(index);
      },
      { rootMargin: NEAR_MARGIN },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [index, onNear]);
  return <div ref={ref} id={unit.id} style={{ minHeight: unit.estimate }} aria-hidden="true" />;
});

type TopicOutlineProps = {
  file: PageFile;
  /** Mount every unit now (set before a jump to an id that may still be a placeholder). */
  mountAll?: boolean;
  /** The reader is reaching for the contents: finish mounting the rest now, in idle moments. */
  warm?: boolean;
};

/** The body of a topic page: the overview, then every section, sub-topic and example in source order. */
export function TopicOutline({ file, mountAll = false, warm = false }: TopicOutlineProps) {
  const units = useMemo(() => buildUnits(file), [file]);
  const { limit, demand } = useUnitLimit(units.length, mountAll, warm);
  return (
    <div className="flex flex-col gap-6 [&>div:first-child>section]:pt-0">
      {units.map((unit, i) =>
        i < limit ? (
          <div key={unit.id} className="contents">
            {unit.render()}
          </div>
        ) : (
          <Placeholder key={unit.id} unit={unit} index={i} onNear={demand} />
        ),
      )}
    </div>
  );
}
