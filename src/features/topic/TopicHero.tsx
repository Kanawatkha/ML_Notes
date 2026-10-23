import type { ReactNode } from 'react';
import { BlockList } from '@/components/content/BlockRenderer';
import { InlineContent } from '@/components/content/InlineContent';
import { Chip } from '@/components/ui/Chip';
import { StatRow } from '@/components/ui/StatRow';
import { KIND_LABEL, PAGES } from '@/config/site';
import type { PageMeta } from '@/content/types';
import { BAND_CLASS } from '@/lib/bands';
import { cn } from '@/lib/cn';

type TopicHeroProps = {
  meta: PageMeta;
  /** Position of the topic among the topic pages, for the "01 / 03" tag. */
  page: (typeof PAGES)[number];
  /** The illustration card, from Phase 7. The text takes the whole band without it. */
  illustration?: ReactNode;
};

/**
 * The coloured feature band at the top of a topic page (the design's dark feature band): mono tag,
 * the page title in the display face, the lead paragraph from the Markdown and the counts of the
 * page, all from the data. Text on the band is white (UI-SPEC.md section 5.1).
 */
export function TopicHero({ meta, page, illustration }: TopicHeroProps) {
  const index = PAGES.findIndex((p) => p.id === page.id) + 1;
  return (
    <section
      aria-labelledby="topic-title"
      data-surface="dark"
      className={cn(
        'grid gap-8 rounded-lg p-8 md:p-12 lg:p-20',
        illustration ? 'lg:grid-cols-[7fr_5fr] lg:items-center' : '',
        BAND_CLASS[page.band].bg,
        BAND_CLASS[page.band].text,
      )}
    >
      <div className="flex min-w-0 flex-col gap-6">
        <Chip tone="on-dark">
          {KIND_LABEL[page.kind]} · {String(index).padStart(2, '0')} /{' '}
          {String(PAGES.length).padStart(2, '0')}
        </Chip>
        <h1 id="topic-title" tabIndex={-1} className="type-product outline-none">
          <InlineContent nodes={meta.title} />
        </h1>
        <div className="type-body-lg max-w-[640px] [&_p]:type-body-lg">
          <BlockList blocks={meta.lead} />
        </div>
        <StatRow
          tone="dark"
          stats={[
            { value: meta.stats.sections + meta.stats.subtopics, label: 'หัวข้อ' },
            { value: meta.stats.examples, label: 'ตัวอย่างโจทย์' },
          ]}
        />
      </div>
      {illustration}
    </section>
  );
}
