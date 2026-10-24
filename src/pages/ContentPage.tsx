import { useEffect, useRef, useState, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import { BackToTop } from '@/components/layout/BackToTop';
import { PageContainer } from '@/components/layout/PageContainer';
import { LoadError } from '@/components/ui/LoadError';
import { PageSkeleton, Skeleton } from '@/components/ui/Skeleton';
import type { ContentPageId } from '@/config/site';
import type { PageMeta } from '@/content/types';
import { RailLayout, TOPIC_END_ID } from '@/features/topic/rail/RailLayout';
import { TopicOutline } from '@/features/topic/TopicOutline';
import { OVERVIEW_ID } from '@/features/topic/units';
import { useAfterPaint } from '@/hooks/useAfterPaint';
import { usePageTitle } from '@/hooks/usePageTitle';
import { usePageContent, usePageMeta } from '@/hooks/usePageContent';
import { jumpTo } from '@/lib/jumpTo';

type ContentPageProps = {
  pageId: ContentPageId;
  /** The browser title: the label of the page. */
  title: string;
  /** The band at the top, drawn from the small meta file. */
  hero: (meta: PageMeta) => ReactNode;
};

/** `?s=1.2/ex1` on a page route names a node of the page; `?s=overview` is the overview panel. */
function targetId(pageId: ContentPageId, s: string | null): string | null {
  if (!s) return null;
  return s === 'overview' ? OVERVIEW_ID(pageId) : `${pageId}/${s}`;
}

/**
 * The shared body of every page built from one Markdown file: a hero from the meta file, then the
 * contents rail with the outline. The topic pages and the definitions page differ only in the hero.
 */
export function ContentPage({ pageId, title, hero }: ContentPageProps) {
  usePageTitle(title);

  const [params] = useSearchParams();
  const target = targetId(pageId, params.get('s'));

  // the hero comes from a small file and is painted first; the big content file follows
  const meta = usePageMeta(pageId);
  const painted = useAfterPaint(meta.status === 'ready');
  const content = usePageContent(pageId, painted);

  // a jump from the contents may name a part that is still a placeholder: mount everything first
  const [mountAll, setMountAll] = useState(false);
  const beforeJump = () => flushSync(() => setMountAll(true));

  // a link with ?s= mounts every part of the page, then scrolls to the part it names, once
  const jumped = useRef('');
  useEffect(() => {
    if (content.status !== 'ready' || !target || jumped.current === target) return;
    jumped.current = target;
    jumpTo(target);
  }, [content.status, target]);

  return (
    <PageContainer className="flex flex-col gap-10 md:gap-12">
      {meta.status === 'ready' ? (
        hero(meta.data)
      ) : meta.status === 'error' ? (
        <LoadError onRetry={meta.retry} />
      ) : (
        <Skeleton className="h-72 rounded-lg" />
      )}
      {/* nothing below the hero until it has arrived, so its arrival moves nothing */}
      {meta.status === 'loading' ? null : content.status === 'ready' ? (
        <RailLayout file={content.data} beforeJump={beforeJump}>
          <TopicOutline file={content.data} mountAll={target !== null || mountAll} />
          <div id={TOPIC_END_ID} aria-hidden="true" />
        </RailLayout>
      ) : (
        <div className="mx-auto w-full max-w-[880px]" aria-busy={content.status === 'loading'}>
          {content.status === 'error' ? <LoadError onRetry={content.retry} /> : <PageSkeleton />}
        </div>
      )}
      <BackToTop />
    </PageContainer>
  );
}
