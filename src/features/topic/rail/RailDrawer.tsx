import { useEffect, useRef, useState } from 'react';
import { UI_TEXT } from '@/config/site';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { RailTree } from './RailTree';
import type { RailEntry, ReadingPosition } from './treeModel';
import './rail.css';

type RailDrawerProps = {
  id: string;
  open: boolean;
  onClose: () => void;
  entries: RailEntry[];
  position: ReadingPosition;
  progress: Record<string, number>;
  onSelect: (id: string) => void;
};

const CLOSE_MS = 220;

/**
 * Contents drawer for phones and tablets (UI-SPEC.md section 6.4): a modal panel from the left over
 * a blurred scrim. A press on the scrim closes it. It stays mounted for the length of the close
 * animation. Focus is trapped while open, Esc closes, the page behind does not scroll. The page
 * unlocks as soon as the drawer starts to close, so a jump chosen in it can scroll at once.
 */
export function RailDrawer({
  id,
  open,
  onClose,
  entries,
  position,
  progress,
  onSelect,
}: RailDrawerProps) {
  const [mounted, setMounted] = useState(open);
  const panelRef = useRef<HTMLDivElement>(null);

  if (open && !mounted) setMounted(true);

  useEffect(() => {
    if (open || !mounted) return;
    const timer = setTimeout(() => setMounted(false), CLOSE_MS);
    return () => clearTimeout(timer);
  }, [open, mounted]);

  useFocusTrap(panelRef, open, onClose);
  useLockBodyScroll(open);

  if (!mounted) return null;

  return (
    <div
      data-state={open ? 'open' : 'closed'}
      className="drawer-scrim fixed inset-0 z-50"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        id={id}
        role="dialog"
        aria-modal="true"
        aria-label={UI_TEXT.railLabel}
        className="drawer-panel flex h-full w-[min(86vw,340px)] flex-col rounded-r-lg bg-canvas px-3 pt-4 pb-24 shadow-[0_24px_64px_rgb(23_23_28/0.25)]"
      >
        <RailTree
          entries={entries}
          position={position}
          progress={progress}
          onSelect={onSelect}
          className="min-h-0 flex-1 overscroll-contain"
        />
      </div>
    </div>
  );
}
