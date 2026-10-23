import { Link } from 'react-router-dom';
import { BlockList } from '@/components/content/BlockRenderer';
import { ExampleCard } from '@/components/content/ExampleCard';
import { InlineContent } from '@/components/content/InlineContent';
import { Button } from '@/components/ui/Button';
import { buttonClass } from '@/components/ui/buttonClass';
import { UI_TEXT, type PageId } from '@/config/site';
import { plainText } from '@/lib/text';
import { examplesButtonId, readHref, type DNode } from './model';

type TopicBlockProps = {
  page: PageId;
  node: DNode;
  crumb: string;
  examplesOpen: boolean;
  /** Id of the example column, passed to aria-controls while it is open. */
  examplesColumnId: string;
  onToggleExamples: () => void;
};

/**
 * Expanded node: breadcrumb, title, explanation and formulas, then a button for the examples (never
 * inline) and a link to the same part on the topic page.
 */
export function TopicBlock({
  page,
  node,
  crumb,
  examplesOpen,
  examplesColumnId,
  onToggleExamples,
}: TopicBlockProps) {
  const count = node.examples.length;
  return (
    <article className="diagram-enter relative z-10 flex flex-col gap-4 rounded-lg border border-hairline bg-canvas p-5 md:p-8">
      <p className="type-mono text-body-muted">{crumb}</p>
      <h2 className="type-feature-heading">
        <InlineContent nodes={node.title} />
      </h2>
      <BlockList blocks={node.explain} />
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2">
        {count > 0 ? (
          <Button
            data-node-id={examplesButtonId(node.id)}
            aria-expanded={examplesOpen}
            aria-controls={examplesOpen ? examplesColumnId : undefined}
            onClick={onToggleExamples}
          >
            {examplesOpen ? UI_TEXT.hideExamples : `${UI_TEXT.showExamples} (${count})`}
          </Button>
        ) : null}
        <Link to={readHref(page, node.read)} className={buttonClass('secondary')}>
          {UI_TEXT.readOnPage}
        </Link>
      </div>
    </article>
  );
}

/** All examples of a node in order, each as the shared example card (problem, Sol, Ans). */
export function ExamplesBlock({ node }: { node: DNode }) {
  return (
    <section
      aria-label={`${UI_TEXT.examples} ${plainText(node.title)}`}
      className="diagram-enter relative z-10 flex flex-col gap-4"
    >
      {node.examples.map((block) =>
        block.t === 'example' ? <ExampleCard key={block.id} block={block} level={3} /> : null,
      )}
    </section>
  );
}
