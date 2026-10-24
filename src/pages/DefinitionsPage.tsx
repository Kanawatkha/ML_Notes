import { REFERENCE_PAGE } from '@/config/site';
import { DefinitionsHero } from '@/features/topic/DefinitionsHero';
import { ContentPage } from '@/pages/ContentPage';

/** The reference page: definitions of every topic, then comparisons between the ones to tell apart. */
export default function DefinitionsPage() {
  return (
    <ContentPage
      pageId={REFERENCE_PAGE.id}
      title={REFERENCE_PAGE.label}
      hero={(meta) => <DefinitionsHero meta={meta} />}
    />
  );
}
