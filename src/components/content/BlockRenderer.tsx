import { memo, type ReactNode } from 'react';
import type { Block } from '@/content/types';
import { ExampleCard } from '@/components/content/ExampleCard';
import { ExerciseCard } from '@/components/content/ExerciseCard';
import { FigureBlock } from '@/components/content/FigureBlock';
import { InlineContent } from '@/components/content/InlineContent';
import { ScrollArea } from '@/components/content/ScrollArea';
import { TableBlock } from '@/components/content/TableBlock';
import { useReveal } from '@/hooks/useReveal';
import { cn } from '@/lib/cn';

/** One block that rises and fades in when it comes into view (UI-SPEC.md, A20). */
function RevealItem({ children }: { children: ReactNode }) {
  const reveal = useReveal('block');
  return <div {...reveal}>{children}</div>;
}

/**
 * Vertical stack of blocks with the standard reading rhythm. With `reveal`, every block enters on
 * its own as it scrolls into view, so a long part is read piece by piece instead of appearing as
 * one still slab. Cards (examples, exercises) have their own entrance and are never wrapped.
 */
export const BlockList = memo(function BlockList({
  blocks,
  className,
  reveal = false,
}: {
  blocks: Block[];
  className?: string;
  reveal?: boolean;
}) {
  if (blocks.length === 0) return null;
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {blocks.map((block, i) =>
        reveal && block.t !== 'example' && block.t !== 'exercise' ? (
          <RevealItem key={i}>
            <BlockRenderer block={block} />
          </RevealItem>
        ) : (
          <BlockRenderer key={i} block={block} />
        ),
      )}
    </div>
  );
});

/** Maps one content block to its component. Adding a block type breaks the build here first. */
export function BlockRenderer({ block }: { block: Block }) {
  switch (block.t) {
    case 'p':
      return (
        <p
          className={cn(
            'type-body',
            block.label && 'mt-4 font-medium',
            block.step && 'mt-6 border-l-2 border-hairline pl-4',
          )}
        >
          <InlineContent nodes={block.c} />
        </p>
      );
    case 'math':
      return <ScrollArea className="overflow-y-hidden" html={block.html} />;
    case 'list': {
      const Tag = block.ordered ? 'ol' : 'ul';
      return (
        <Tag
          className={cn(
            'type-body flex flex-col gap-2 ps-6',
            block.ordered ? 'list-decimal' : 'list-disc',
          )}
        >
          {block.items.map((item, i) => (
            <li key={i} className="ps-1">
              <InlineContent nodes={item.c} />
              <BlockList blocks={item.children} className="mt-2" />
            </li>
          ))}
        </Tag>
      );
    }
    case 'table':
      return <TableBlock head={block.head} rows={block.rows} />;
    case 'figure':
      return <FigureBlock svg={block.svg} label={block.label} />;
    case 'note':
      return (
        <aside className="rounded-sm bg-soft-stone p-4">
          <BlockList blocks={block.c} />
        </aside>
      );
    case 'example':
      return <ExampleCard block={block} level={3} />;
    case 'exercise':
      return <ExerciseCard block={block} level={3} />;
  }
}
