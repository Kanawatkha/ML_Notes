import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { padNumber } from '@/lib/text';
import { ProgressRing } from './ProgressRing';
import type { RailEntry, ReadingPosition } from './treeModel';

type RailTreeProps = {
  entries: RailEntry[];
  position: ReadingPosition;
  progress: Record<string, number>;
  onSelect: (id: string) => void;
  /** Sizing of the scrolling container (the tree scrolls inside it when it is longer than the window). */
  className?: string;
};

/** Height animation without measuring: a one-row grid that goes from 0fr to 1fr. */
function Expand({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <div
      inert={!open}
      className={cn(
        'grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none',
        open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
      )}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}

/**
 * The contents: the overview, the sections, and under the section being read its examples and
 * sub-topics (and under the sub-topic being read its examples). The section and the sub-topic that
 * hold the reading position are expanded, the rest are folded, so every entry is reachable without a
 * very long list. One highlight slides to the current entry.
 */
export function RailTree({ entries, position, progress, onSelect, className }: RailTreeProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);
  const placed = useRef(false);

  // Slides the highlight to the current entry, and keeps up while the tree expands or the window resizes.
  useLayoutEffect(() => {
    const list = listRef.current;
    const marker = markerRef.current;
    const scroller = scrollRef.current;
    if (!list || !marker) return;

    const place = () => {
      const entry = Array.from(list.querySelectorAll<HTMLElement>('[data-rail-id]')).find(
        (el) => el.dataset.railId === position.entryId,
      );
      if (!entry) {
        marker.style.opacity = '0';
        return;
      }
      if (!placed.current) {
        // the first placement jumps there instead of sliding in from the top
        marker.style.transition = 'none';
        placed.current = true;
      }
      marker.style.height = `${entry.offsetHeight}px`;
      marker.style.transform = `translateY(${entry.offsetTop}px)`;
      marker.style.opacity = '1';
      if (marker.style.transition === 'none') {
        void marker.offsetHeight;
        marker.style.transition = '';
      }
      if (scroller) {
        const top = entry.offsetTop;
        const bottom = top + entry.offsetHeight;
        if (
          top < scroller.scrollTop + 8 ||
          bottom > scroller.scrollTop + scroller.clientHeight - 8
        ) {
          scroller.scrollTo({
            top: Math.max(0, top - scroller.clientHeight / 2),
            behavior: 'smooth',
          });
        }
      }
    };

    place();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(place);
    observer.observe(list);
    return () => observer.disconnect();
  }, [position.entryId]);

  const entryButton = (e: RailEntry, depth: 1 | 2 | 3) => {
    const current = e.id === position.entryId;
    return (
      <button
        type="button"
        data-rail-id={e.id}
        aria-current={current ? 'location' : undefined}
        onClick={() => onSelect(e.id)}
        className={cn(
          'relative flex w-full items-center gap-3 rounded-sm py-2 pe-3 ps-3 text-start',
          depth === 1 ? 'type-button' : 'type-caption',
          current ? 'font-medium' : depth === 1 ? '' : 'text-body-muted',
          current && depth > 1 && 'text-ink',
        )}
      >
        {e.kind === 'section' ? <ProgressRing value={progress[e.id] ?? 0} /> : null}
        {e.number ? (
          <span className="type-mono shrink-0 text-body-muted tabular">{padNumber(e.number)}</span>
        ) : null}
        {e.exIndex ? (
          <span className="type-mono shrink-0 text-body-muted tabular">
            EX {String(e.exIndex).padStart(2, '0')}
          </span>
        ) : null}
        <span className="min-w-0">{e.label}</span>
      </button>
    );
  };

  const subList = (children: RailEntry[], depth: 2 | 3, open: boolean, indent: string) => (
    <Expand open={open}>
      <ul className={cn('flex flex-col gap-1 border-s border-hairline ps-2', indent)}>
        {children.map((child) => (
          <li key={child.id}>
            {entryButton(child, depth)}
            {child.children.length > 0
              ? subList(child.children, 3, child.id === position.subtopicId, 'ms-4')
              : null}
          </li>
        ))}
      </ul>
    </Expand>
  );

  return (
    <div
      ref={scrollRef}
      className={cn(
        'overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        className,
      )}
    >
      <ul ref={listRef} className="relative flex flex-col gap-1">
        <span
          ref={markerRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 rounded-sm border-s-[3px] border-ink bg-soft-stone opacity-0 transition-[transform,height] duration-300 ease-out motion-reduce:transition-none"
        />
        {entries.map((section) => (
          <li key={section.id}>
            {entryButton(section, 1)}
            {section.children.length > 0
              ? subList(section.children, 2, section.id === position.sectionId, 'ms-5')
              : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
