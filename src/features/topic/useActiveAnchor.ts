import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { flattenRail, positionOf, type RailEntry, type ReadingPosition } from './rail/treeModel';

/** A part of the page counts as "reached" once its top is this far below the top of the window. */
export const REACH_OFFSET = 120;
/** Longest a click-triggered smooth scroll is trusted to run; scroll tracking is paused meanwhile. */
const LOCK_MS = 1000;

export type ReadingState = {
  position: ReadingPosition;
  /** 0 to 1 per section: how far the reading line has moved through that section. */
  progress: Record<string, number>;
};

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const round2 = (n: number) => Math.round(n * 100) / 100;

function sameState(a: ReadingState, b: ReadingState): boolean {
  if (a.position.entryId !== b.position.entryId) return false;
  for (const key of Object.keys(b.progress)) if (a.progress[key] !== b.progress[key]) return false;
  return true;
}

/**
 * Scroll spy for the contents. One scroll listener (throttled to a frame) works out the deepest
 * entry the reader has reached and how far through each section the reading line is. A section
 * runs from its own top to the top of the next section; the last one ends at the element `endId`
 * (the end of the page body). `activate` sets the position at once (a click on the contents) and
 * pauses the spy until the scroll that follows has ended, so the highlight goes straight to its
 * target instead of racing through every entry on the way.
 */
export function useActiveAnchor(entries: RailEntry[], endId: string) {
  const flat = useMemo(() => flattenRail(entries), [entries]);
  const sections = useMemo(() => entries.filter((e) => e.kind !== 'overview'), [entries]);
  const first = flat[0];
  const [state, setState] = useState<ReadingState>(() => ({
    position: first ? positionOf(first) : { entryId: '', sectionId: '' },
    progress: Object.fromEntries(sections.map((s) => [s.id, 0])),
  }));
  const lockUntil = useRef(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      if (performance.now() < lockUntil.current) return;

      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

      let current = flat[0];
      for (const entry of flat) {
        const el = document.getElementById(entry.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= REACH_OFFSET) current = entry;
        else break;
      }
      if (atBottom && flat.length > 0) current = flat[flat.length - 1];

      const progress: Record<string, number> = {};
      const endTop = document.getElementById(endId)?.getBoundingClientRect().top;
      sections.forEach((section, i) => {
        const top = document.getElementById(section.id)?.getBoundingClientRect().top;
        const next = sections[i + 1];
        const bottom = next
          ? document.getElementById(next.id)?.getBoundingClientRect().top
          : endTop;
        if (top === undefined || bottom === undefined || bottom <= top) {
          progress[section.id] = 0;
          return;
        }
        progress[section.id] = round2(clamp01((REACH_OFFSET - top) / (bottom - top)));
      });
      const last = sections[sections.length - 1];
      if (atBottom && last) progress[last.id] = 1;

      const next: ReadingState = {
        position: current ? positionOf(current) : { entryId: '', sectionId: '' },
        progress,
      };
      setState((prev) => (sameState(prev, next) ? prev : next));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onScrollEnd = () => {
      lockUntil.current = 0;
      schedule();
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('scrollend', onScrollEnd);
    schedule();
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('scrollend', onScrollEnd);
      cancelAnimationFrame(frame);
    };
  }, [flat, sections, endId]);

  const activate = useCallback(
    (id: string) => {
      const entry = flat.find((e) => e.id === id);
      if (!entry) return;
      setState((prev) => ({ ...prev, position: positionOf(entry) }));
      lockUntil.current = performance.now() + LOCK_MS;
      // browsers without a scrollend event: resume tracking once the lock has run out
      setTimeout(() => window.dispatchEvent(new Event('scroll')), LOCK_MS + 50);
    },
    [flat],
  );

  return { ...state, activate };
}
