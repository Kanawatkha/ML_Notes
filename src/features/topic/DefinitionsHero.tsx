import { BlockList } from '@/components/content/BlockRenderer';
import { InlineContent } from '@/components/content/InlineContent';
import { Chip } from '@/components/ui/Chip';
import { StatRow } from '@/components/ui/StatRow';
import { UI_TEXT } from '@/config/site';
import type { PageMeta } from '@/content/types';

/**
 * The top of the definitions page. It is a reference, not a topic, so the band is the light
 * soft-stone surface with ink text (no topic colour, no drawing), laid out like the topic hero.
 */
export function DefinitionsHero({ meta }: { meta: PageMeta }) {
  return (
    <section
      aria-labelledby="topic-title"
      className="flex flex-col gap-6 rounded-lg bg-soft-stone p-8 text-ink md:p-12 lg:p-20"
    >
      <Chip>{UI_TEXT.definitionsTag}</Chip>
      <h1 id="topic-title" tabIndex={-1} className="type-product outline-none">
        <InlineContent nodes={meta.title} />
      </h1>
      <div className="type-body-lg max-w-[640px] [&_p]:type-body-lg">
        <BlockList blocks={meta.lead} />
      </div>
      <StatRow stats={[{ value: meta.stats.sections + meta.stats.subtopics, label: 'หัวข้อ' }]} />
    </section>
  );
}
