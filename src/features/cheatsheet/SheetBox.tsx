import { BlockList } from '@/components/content/BlockRenderer';
import { InlineContent } from '@/components/content/InlineContent';
import type { ContentNode } from '@/content/types';

/** One ruled box of the sheet: a pen-blue title and the content below it. */
export function SheetBox({ node }: { node: ContentNode }) {
  return (
    <section
      id={node.id}
      aria-label={node.title.map((t) => (t.t === 'text' ? t.v : '')).join('')}
      className="sheet-box"
    >
      <h2 className="sheet-title">
        <InlineContent nodes={node.title} />
      </h2>
      <BlockList blocks={node.explain} />
    </section>
  );
}
