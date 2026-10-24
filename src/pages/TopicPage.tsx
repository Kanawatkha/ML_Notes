import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import { BackToTop } from '@/components/layout/BackToTop';
import { PageContainer } from '@/components/layout/PageContainer';
import { LoadError } from '@/components/ui/LoadError';
import { PageSkeleton, Skeleton } from '@/components/ui/Skeleton';
import { PAGES, type PageId } from '@/config/site';
import { TopicHero } from '@/features/topic/TopicHero';
import { TopicIllustration } from '@/features/topic/TopicIllustration';
import { RailLayout, TOPIC_END_ID } from '@/features/topic/rail/RailLayout';
import { TopicOutline } from '@/features/topic/TopicOutline';
import { OVERVIEW_ID } from '@/features/topic/units';
import { useAfterPaint } from '@/hooks/useAfterPaint';
import { usePageTitle } from '@/hooks/usePageTitle';
import { usePageContent, usePageMeta } from '@/hooks/usePageContent';
import { jumpTo } from '@/lib/jumpTo';

type TopicPageProps = { pageId: PageId };

/** `?s=1.2/ex1` on a topic route names a node of the page; `?s=overview` is the overview panel. */
function targetId(pageId: PageId, s: string | null): string | null {
  if (!s) return null;
  return s === 'overview' ? OVERVIEW_ID(pageId) : `${pageId}/${s}`;
}

export default function TopicPage({ pageId }: TopicPageProps) {
  const page = PAGES.find((p) => p.id === pageId) ?? PAGES[0];
  usePageTitle(page.label);

  const [params] = useSearchParams();
  const target = targetId(pageId, params.get('s'));

  // the hero comes from a small file and is painted first; the big content file follows
  const meta = usePageMeta(pageId);
  const painted = useAfterPaint(meta.status === 'ready');
  const content = usePageContent(pageId, painted);

  // a jump from the contents may name a part that is still a placeholder: mount everything first
  const [mountAll, setMountAll] = useState(false);
  const beforeJump = () => flushSync(() => setMountAll(true));
  // reaching for the contents starts mounting the rest early, so the jump finds it ready
  const [warm, setWarm] = useState(false);
  const onWarm = useCallback(() => setWarm(true), []);

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
        <TopicHero
          meta={meta.data}
          page={page}
          illustration={<TopicIllustration pageId={pageId} />}
        />
      ) : meta.status === 'error' ? (
        <LoadError onRetry={meta.retry} />
      ) : (
        <Skeleton className="h-72 rounded-lg" />
      )}
      {/* nothing below the hero until it has arrived, so its arrival moves nothing */}
      {meta.status === 'loading' ? null : content.status === 'ready' ? (
        <RailLayout file={content.data} beforeJump={beforeJump} onWarm={onWarm}>
          <TopicOutline file={content.data} mountAll={target !== null || mountAll} warm={warm} />
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
