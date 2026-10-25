import { PageContainer } from '@/components/layout/PageContainer';
import { InlineContent } from '@/components/content/InlineContent';
import { LoadError } from '@/components/ui/LoadError';
import { Skeleton } from '@/components/ui/Skeleton';
import { CHEATSHEET_PAGE } from '@/config/site';
import { CheatSheet } from '@/features/cheatsheet/CheatSheet';
import { usePageContent, usePageMeta } from '@/hooks/usePageContent';
import { usePageTitle } from '@/hooks/usePageTitle';

/** The two-sided A4 cheat sheet for the exam, ready to copy by hand or print. */
export default function CheatSheetPage() {
  usePageTitle(CHEATSHEET_PAGE.label);
  const meta = usePageMeta(CHEATSHEET_PAGE.id);
  const content = usePageContent(CHEATSHEET_PAGE.id);

  return (
    <PageContainer className="flex flex-col gap-6 print:p-0">
      {meta.status === 'ready' ? (
        <h1 id="topic-title" tabIndex={-1} className="sr-only">
          <InlineContent nodes={meta.data.title} />
        </h1>
      ) : null}
      {content.status === 'ready' ? (
        <CheatSheet file={content.data} />
      ) : content.status === 'error' ? (
        <LoadError onRetry={content.retry} />
      ) : (
        <Skeleton className="h-[70vh] rounded-lg print:hidden" />
      )}
    </PageContainer>
  );
}
