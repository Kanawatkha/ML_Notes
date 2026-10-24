import { BlockList } from '@/components/content/BlockRenderer';
import { InlineContent } from '@/components/content/InlineContent';
import { Chip } from '@/components/ui/Chip';
import { UI_TEXT } from '@/config/site';
import { useReveal } from '@/hooks/useReveal';
import type { Block, ContentNode } from '@/content/types';
import { padNumber } from '@/lib/text';

export function Overview({ id, blocks }: { id: string; blocks: Block[] }) {
  const reveal = useReveal();
  return (
    <section
      {...reveal}
      id={id}
      tabIndex={-1}
      aria-labelledby={`${id}-label`}
      className="flex scroll-mt-24 flex-col gap-4 rounded-md bg-soft-stone p-5 outline-none md:p-8"
    >
      <p id={`${id}-label`} className="type-caption font-medium text-body-muted">
        {UI_TEXT.overview}
      </p>
      <BlockList blocks={blocks} reveal />
    </section>
  );
}

export function SectionPart({ node, blocks }: { node: ContentNode; blocks: Block[] }) {
  const isSection = node.kind === 'section';
  const headingId = `${node.id}-title`;
  const reveal = useReveal('parts');
  return (
    <section
      id={node.id}
      tabIndex={-1}
      aria-labelledby={headingId}
      className={
        isSection
          ? 'flex scroll-mt-24 flex-col gap-5 pt-16 outline-none md:pt-24'
          : 'flex scroll-mt-24 flex-col gap-4 pt-8 outline-none md:pt-12'
      }
    >
      {isSection ? (
        <header {...reveal} className="relative flex items-baseline gap-4 pt-4">
          <span aria-hidden="true" className="rule-grow absolute inset-x-0 top-0 h-px bg-ink" />
          <span className="type-mono fade-up text-body-muted">{padNumber(node.number ?? '')}</span>
          <h2 id={headingId} className="type-card-heading fade-up">
            <InlineContent nodes={node.title} />
          </h2>
        </header>
      ) : (
        <header {...reveal} className="flex flex-wrap items-center gap-3">
          <Chip className="fade-up">{node.number}</Chip>
          <h3 id={headingId} className="type-feature-heading fade-up">
            <InlineContent nodes={node.title} />
          </h3>
        </header>
      )}
      <BlockList blocks={blocks} reveal />
    </section>
  );
}
