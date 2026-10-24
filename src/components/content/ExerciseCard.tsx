import { BlockList } from '@/components/content/BlockRenderer';
import { InlineContent } from '@/components/content/InlineContent';
import { Chip } from '@/components/ui/Chip';
import { UI_TEXT } from '@/config/site';
import type { Block } from '@/content/types';
import { useReveal } from '@/hooks/useReveal';

type ExerciseBlock = Extract<Block, { t: 'exercise' }>;

type ExerciseCardProps = {
  block: ExerciseBlock;
  /** Heading level of the title: 3 under a section, 4 under a sub-topic. */
  level: 3 | 4;
  /** The first exercise of a topic also carries the "แบบฝึกหัด" label above it. */
  first?: boolean;
};

/**
 * One exercise: a problem to solve by yourself, with no solution. It differs from a worked example
 * on purpose (soft-stone fill and a dashed border instead of a white card with a solid one), so
 * the two are never mistaken for each other. The first exercise of a topic has a ruled label above
 * it that names the group.
 */
export function ExerciseCard({ block, level, first = false }: ExerciseCardProps) {
  const Heading = level === 3 ? 'h3' : 'h4';
  const entrance = useReveal();
  return (
    <>
      {first ? (
        <div className="mt-10 flex flex-col gap-1 border-t border-ink pt-4">
          <p className="type-feature-heading">{UI_TEXT.exercisesLabel}</p>
          <p className="type-caption text-body-muted">{UI_TEXT.exercisesHint}</p>
        </div>
      ) : null}
      <article
        {...entrance}
        id={block.id}
        tabIndex={-1}
        className="flex scroll-mt-24 flex-col gap-4 rounded-md border border-dashed border-ink/40 bg-soft-stone p-5 outline-none md:p-8"
      >
        <header className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <Chip tone="coral">PR {String(block.index).padStart(2, '0')}</Chip>
          <Heading className="type-feature-heading">
            <InlineContent nodes={block.title} />
          </Heading>
        </header>
        <BlockList blocks={block.problem} />
      </article>
    </>
  );
}
