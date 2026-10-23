import type { Cell, CellAlign, Inline } from '@/content/types';
import { InlineContent } from '@/components/content/InlineContent';
import { ScrollArea } from '@/components/content/ScrollArea';
import { cn } from '@/lib/cn';
import { texLabel } from '@/lib/text';

const ALIGN_CLASS: Record<CellAlign, string> = {
  l: 'text-left',
  c: 'text-center',
  r: 'text-right',
};

/** A header cell that holds nothing but formulas gets a readable name (see texLabel). */
function formulaOnlyLabel(cell: Inline[]): string | undefined {
  if (cell.length === 0 || !cell.every((n) => n.t === 'math')) return undefined;
  return cell.map((n) => (n.t === 'math' ? texLabel(n.tex) : '')).join(' ');
}

const CELL = 'tabular min-w-12 px-3.5 py-2 align-middle';

function HeadCell({ cell }: { cell: Cell }) {
  // an empty header cell is not a column label, so it is a plain cell
  if (cell.c.length === 0) return <td className={cn(CELL, 'border-b border-ink')} />;
  const label = formulaOnlyLabel(cell.c);
  return (
    <th
      scope="col"
      aria-label={label}
      className={cn(CELL, 'border-b border-ink font-medium', ALIGN_CLASS[cell.align ?? 'c'])}
    >
      <InlineContent nodes={cell.c} />
      {label ? <span className="sr-only">{label}</span> : null}
    </th>
  );
}

function BodyCell({ cell }: { cell: Cell }) {
  if (cell.header) {
    return (
      <th scope="row" className={cn(CELL, 'text-left font-medium')}>
        <InlineContent nodes={cell.c} />
      </th>
    );
  }
  return (
    <td className={cn(CELL, ALIGN_CLASS[cell.align ?? 'c'])}>
      <InlineContent nodes={cell.c} />
    </td>
  );
}

type TableBlockProps = { head: Cell[][]; rows: Cell[][] };

/**
 * Data table (the design's research-table chrome): rows separated by hairline rules, a firm rule
 * under the header, centered when narrow. The wrapper scrolls sideways so a wide table never
 * widens the page. Row headers (a header cell in a body row) are real row headers.
 */
export function TableBlock({ head, rows }: TableBlockProps) {
  return (
    <ScrollArea>
      <table className="type-body mx-auto border-collapse">
        {head.length > 0 ? (
          <thead>
            {head.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => (
                  <HeadCell key={c} cell={cell} />
                ))}
              </tr>
            ))}
          </thead>
        ) : null}
        <tbody>
          {rows.map((row, r) => (
            <tr key={r} className="border-b border-hairline last:border-b-0">
              {row.map((cell, c) => (
                <BodyCell key={c} cell={cell} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollArea>
  );
}
