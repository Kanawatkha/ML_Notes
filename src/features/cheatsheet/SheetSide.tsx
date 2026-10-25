import { useLayoutEffect, useRef } from 'react';
import type { ContentNode } from '@/content/types';
import { fitPage } from './fit';
import { SHEET_COLUMNS } from './layout';
import { SheetBox } from './SheetBox';

type SheetSideProps = { boxes: ContentNode[]; label: string; scale: number };

/**
 * One side of the paper (210 x 297 mm). The boxes flow through the columns and the whole side is
 * set in the largest font that fits. It is fitted again when the fonts finish loading, because
 * the formulas change width then.
 */
export function SheetSide({ boxes, label, scale }: SheetSideProps) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const page = ref.current;
    if (!page) return;
    const run = () => fitPage(page);
    run();
    if (typeof document !== 'undefined' && document.fonts) {
      void document.fonts.ready.then(run);
      document.fonts.addEventListener('loadingdone', run);
      return () => document.fonts.removeEventListener('loadingdone', run);
    }
  }, [boxes]);

  return (
    <article
      ref={ref}
      aria-label={label}
      className="sheet-page"
      style={{ transform: `scale(${scale})`, columnCount: SHEET_COLUMNS }}
    >
      {boxes.map((box) => (
        <SheetBox key={box.id} node={box} />
      ))}
    </article>
  );
}
