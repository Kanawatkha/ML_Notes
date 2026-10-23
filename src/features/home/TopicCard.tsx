import { InlineContent } from '@/components/content/InlineContent';
import { ButtonLink } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { KIND_LABEL, UI_TEXT, type PAGES } from '@/config/site';
import type { HomeFile, OutlineNode } from '@/content/types';
import { useReveal } from '@/hooks/useReveal';
import { BAND_CLASS } from '@/lib/bands';
import { cn } from '@/lib/cn';
import { plainText } from '@/lib/text';

/** The rows of a card: one per section, with the sub-topics of a group listed under it. */
function rows(
  outline: OutlineNode,
): { id: string; title: OutlineNode['title']; detail?: string }[] {
  return outline.children.map((section) => ({
    id: section.id,
    title: section.title,
    detail:
      section.children.length > 0
        ? section.children.map((c) => plainText(c.title)).join(' · ')
        : undefined,
  }));
}

/**
 * One card per topic (the design's product card): mono tag and colour swatch, the Latin title, a
 * rule, a check row for every section (a group lists its sub-topics under it) and a pill link to
 * the page. The rows come from the home file, never from typed text. Rises once when it scrolls
 * into view (A9).
 */
export function TopicCard({
  page,
  entry,
}: {
  page: (typeof PAGES)[number];
  entry: HomeFile['pages'][number];
}) {
  const reveal = useReveal();
  return (
    <article
      {...reveal}
      className="card-hover flex w-full flex-col gap-5 rounded-sm border border-transparent bg-soft-stone p-6 md:p-8"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className={cn('size-3 shrink-0 rounded-xs', BAND_CLASS[page.band].bg)}
        />
        <Chip>{KIND_LABEL[page.kind]}</Chip>
      </div>
      <h3 className="type-card-heading font-display">
        <InlineContent nodes={entry.title} />
      </h3>
      <hr className="border-hairline" />
      <ul className="type-body flex flex-1 flex-col gap-3">
        {rows(entry.outline).map((row) => (
          <li key={row.id} className="flex items-start gap-3">
            <Icon name="check" size={18} className="mt-1 shrink-0" />
            <span>
              <InlineContent nodes={row.title} />
              {row.detail ? (
                <span className="type-caption block text-body-muted">{row.detail}</span>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
      <ButtonLink to={page.route} className="self-start">
        {UI_TEXT.openPage}
      </ButtonLink>
    </article>
  );
}
