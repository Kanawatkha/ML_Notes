import { useMemo, useRef, useState, type ReactNode } from 'react';
import { UI_TEXT } from '@/config/site';
import type { PageFile } from '@/content/types';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/cn';
import { jumpTo } from '@/lib/jumpTo';
import { OVERVIEW_ID } from '../units';
import { useActiveAnchor } from '../useActiveAnchor';
import { RailDrawer } from './RailDrawer';
import { RailToggle } from './RailToggle';
import { RailTree } from './RailTree';
import { buildRailTree } from './treeModel';

const RAIL_ID = 'contents-rail';
const DRAWER_ID = 'contents-drawer';

/**
 * Room the toggle needs in the page margin: 60 px (48 px button, 12 px gap) plus an 8 px distance
 * from the window edge, less the margin the page already has: the 24 px gutter of the 1200 px
 * column plus half of what that column leaves. On a wide screen it is 0 and the button sits
 * entirely outside the content; on a narrow desktop the content makes room instead.
 */
const RAIL_PAD = '[--rail-pad:max(0px,calc(44px_-_max(0px,calc((100vw_-_1200px)/2))))]';

/** id of the empty element after the page body; the last section runs up to it. */
export const TOPIC_END_ID = 'topic-end';

type RailLayoutProps = {
  file: PageFile;
  /** Runs right before a jump, for example to mount parts that are still placeholders. */
  beforeJump?: () => void;
  /** The reader reached for the contents (pointer or focus on it, or opened the drawer). */
  onWarm?: () => void;
  children: ReactNode;
};

/**
 * Puts the contents next to the page body (UI-SPEC.md section 6).
 *
 * Desktop (1024 px and up): an icon button in the page margin, outside the content and right-aligned
 * to its edge, folds a sticky rail. The body takes all the room that is left, so it is as wide as
 * the hero with the rail folded and narrower by the rail with it open. The width of the rail column is animated (a CSS transition on the grid
 * columns), so the body grows and shrinks with it. Reduced motion changes at once.
 *
 * Below that: one column, a round floating button at the bottom left, and the same contents in a
 * drawer. Only one of the two layouts is rendered, so there is never a second, hidden tree.
 */
export function RailLayout({ file, beforeJump, onWarm, children }: RailLayoutProps) {
  const desktop = useMediaQuery('(min-width: 1024px)');
  const entries = useMemo(() => buildRailTree(file, OVERVIEW_ID(file.id)), [file]);
  const reading = useActiveAnchor(entries, TOPIC_END_ID);
  const [railOpen, setRailOpen] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fabRef = useRef<HTMLButtonElement>(null);

  const select = (id: string) => {
    reading.activate(id);
    beforeJump?.();
    jumpTo(id);
  };

  const selectInDrawer = (id: string) => {
    setDrawerOpen(false);
    // the page is scroll-locked until the drawer has started to close
    window.setTimeout(() => select(id), 50);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    fabRef.current?.focus();
  };

  // the drawer has no place on a wide screen: close it in the same render, so it never reopens on narrowing
  if (desktop && drawerOpen) setDrawerOpen(false);

  if (desktop) {
    return (
      <div className={cn('relative pl-[var(--rail-pad)]', RAIL_PAD)}>
        {/* the toggle sits in the page margin, right-aligned to the content edge */}
        <div className="absolute inset-y-0 left-[calc(var(--rail-pad)-60px)] z-10 w-12">
          <div className="sticky top-20">
            <RailToggle
              open={railOpen}
              onClick={() => setRailOpen((open) => !open)}
              controls={RAIL_ID}
            />
          </div>
        </div>
        <div
          className={cn(
            'grid overflow-x-clip',
            railOpen ? 'grid-cols-[264px_minmax(0,1fr)]' : 'grid-cols-[0px_minmax(0,1fr)]',
          )}
        >
          <div aria-hidden={!railOpen} inert={!railOpen}>
            <div
              className={cn(
                'sticky top-20 w-[248px] transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none',
                railOpen ? 'translate-x-0 opacity-100' : '-translate-x-6 opacity-0',
              )}
            >
              <nav
                id={RAIL_ID}
                aria-label={UI_TEXT.railLabel}
                onPointerEnter={onWarm}
                onFocusCapture={onWarm}
              >
                <RailTree
                  entries={entries}
                  position={reading.position}
                  progress={reading.progress}
                  onSelect={select}
                  className="max-h-[calc(100dvh-8rem)]"
                />
              </nav>
            </div>
          </div>
          <div className="w-full">{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[880px]">
      {children}
      <RailToggle
        ref={fabRef}
        open={drawerOpen}
        onClick={() => {
          onWarm?.();
          setDrawerOpen((open) => !open);
        }}
        controls={DRAWER_ID}
        className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-[max(1rem,env(safe-area-inset-left))] z-[60] size-12"
      />
      <RailDrawer
        id={DRAWER_ID}
        open={drawerOpen}
        onClose={closeDrawer}
        entries={entries}
        position={reading.position}
        progress={reading.progress}
        onSelect={selectInDrawer}
      />
    </div>
  );
}
