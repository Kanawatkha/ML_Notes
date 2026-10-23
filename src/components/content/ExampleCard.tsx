import type { Block } from '@/content/types';
import { BlockList } from '@/components/content/BlockRenderer';
import { InlineContent } from '@/components/content/InlineContent';
import { Chip } from '@/components/ui/Chip';
import { useReveal } from '@/hooks/useReveal';

type ExampleBlock = Extract<Block, { t: 'example' }>;

type ExampleCardProps = {
  block: ExampleBlock;
  /** Heading level of the title: 3 under a section, 4 under a sub-topic. */
  level: 3 | 4;
  /** One-time entrance when it scrolls into view (topic pages); off inside the Home diagram. */
  reveal?: boolean;
};

/**
 * One worked example: the EX chip and title, the problem, the Sol label, the steps and the Ans
 * strip (UI-SPEC.md section 5.4). The title and the Sol label are the headings of the Markdown,
 * unchanged; only the "EX 03" chip is generated. Shared by the topic pages and the Home diagram.
 */
export function ExampleCard({ block, level, reveal = false }: ExampleCardProps) {
  const Heading = level === 3 ? 'h3' : 'h4';
  const entrance = useReveal();
  return (
    <article
      {...(reveal ? entrance : {})}
      id={block.id}
      tabIndex={-1}
      className="flex scroll-mt-24 flex-col gap-4 rounded-md border border-hairline bg-canvas p-5 outline-none md:p-8"
    >
      <header className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <Chip tone="coral">EX {String(block.index).padStart(2, '0')}</Chip>
        <Heading className="type-feature-heading">
          <InlineContent nodes={block.title} />
        </Heading>
      </header>
      <BlockList blocks={block.problem} />
      <p className="type-caption w-fit rounded-full bg-soft-stone px-3 py-1 font-medium">
        <InlineContent nodes={block.solLabel} />
      </p>
      <BlockList blocks={block.sol} />
      {block.ans.length > 0 ? (
        <div className="rounded-xs border-l-[3px] border-deep-green bg-pale-green px-5 py-4">
          <BlockList blocks={block.ans} />
        </div>
      ) : null}
    </article>
  );
}
