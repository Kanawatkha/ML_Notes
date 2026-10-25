import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { UI_TEXT } from '@/config/site';
import type { PageFile } from '@/content/types';
import { cn } from '@/lib/cn';
import { SHEET_SIDE } from './layout';
import { SheetSide } from './SheetSide';
import './sheet.css';

/** A4 in CSS px at 96 dpi (210 x 297 mm). */
export const PAGE_W = 793.7;
export const PAGE_H = 1122.5;
/** Below this width two pages no longer sit side by side. */
const SIDE_BY_SIDE_MIN = 900;
const GAP = 24;
const MAX_SCALE = 1.5;

type View = 'front' | 'back' | 'both';

const VIEWS: { id: View; label: string }[] = [
  { id: 'front', label: UI_TEXT.sheetFront },
  { id: 'back', label: UI_TEXT.sheetBack },
  { id: 'both', label: UI_TEXT.sheetBoth },
];

const SIDE_LABEL = [UI_TEXT.sheetFront, UI_TEXT.sheetBack] as const;

/**
 * The two-sided A4 cheat sheet. Both sides are always in the document (the one not shown is only
 * moved out of sight), so they are measured and fitted once and printing always gives both. The
 * sides are laid out at real size and shown with a CSS scale that fits the window; printing drops
 * the scale (sheet.css), so the paper gets exactly 210 x 297 mm.
 */
export function CheatSheet({ file }: { file: PageFile }) {
  const [view, setView] = useState<View>('both');
  const [width, setWidth] = useState(0);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth);
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const sides = useMemo(() => {
    const boxes = file.root.children.flatMap((section) => section.children);
    return [0, 1].map((side) => boxes.filter((box) => SHEET_SIDE[box.id] === side));
  }, [file]);

  const sideBySide = view === 'both' && width >= SIDE_BY_SIDE_MIN;
  const room = sideBySide ? (width - GAP) / 2 : width;
  const scale = width === 0 ? 1 : Math.min(MAX_SCALE, room / PAGE_W);

  return (
    <div className="flex flex-col gap-6">
      <div className="sheet-toolbar flex flex-wrap items-center gap-3 print:hidden">
        <div role="group" aria-label={UI_TEXT.sheetViews} className="flex flex-wrap gap-2">
          {VIEWS.map((v) => (
            <Button
              key={v.id}
              variant="outline"
              aria-pressed={view === v.id}
              className="aria-pressed:bg-primary! aria-pressed:text-on-primary!"
              onClick={() => setView(v.id)}
            >
              {v.label}
            </Button>
          ))}
        </div>
        <Button variant="primary" onClick={() => window.print()} className="md:ml-auto">
          {UI_TEXT.sheetExport}
        </Button>
      </div>

      <div ref={stage} className={cn('sheet-stage', sideBySide && 'is-side')}>
        {sides.map((boxes, i) => {
          const id = i === 0 ? 'front' : 'back';
          const shown = view === 'both' || view === id;
          return (
            <div
              key={id}
              className={cn('sheet-wrap', !shown && 'is-off')}
              aria-hidden={!shown}
              inert={!shown}
              style={{ width: PAGE_W * scale, height: PAGE_H * scale }}
            >
              <SheetSide boxes={boxes} label={SIDE_LABEL[i]} scale={scale} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
