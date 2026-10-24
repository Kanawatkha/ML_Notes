import { PAGES, type PageId } from '@/config/site';
import { TopicHero } from '@/features/topic/TopicHero';
import { TopicIllustration } from '@/features/topic/TopicIllustration';
import { ContentPage } from '@/pages/ContentPage';

type TopicPageProps = { pageId: PageId };

/** One of the three topic pages: a coloured hero with its drawing, then the content. */
export default function TopicPage({ pageId }: TopicPageProps) {
  const page = PAGES.find((p) => p.id === pageId) ?? PAGES[0];
  return (
    <ContentPage
      pageId={pageId}
      title={page.label}
      hero={(meta) => (
        <TopicHero meta={meta} page={page} illustration={<TopicIllustration pageId={pageId} />} />
      )}
    />
  );
}
