import { PageContainer } from '@/components/layout/PageContainer';
import { UI_TEXT } from '@/config/site';
import { HomeHero } from '@/features/home/HomeHero';
import { HomeDiagram } from '@/features/home-diagram/HomeDiagram';
import { useHome } from '@/hooks/useHome';
import { usePageTitle } from '@/hooks/usePageTitle';

/**
 * The hero, then the exam-scope diagram. The diagram section is full width on purpose: the
 * columns run past the content column and scroll sideways, with no frame around them.
 */
export default function HomePage() {
  usePageTitle();
  const home = useHome();
  return (
    <div className="flex flex-col gap-10 pb-12 md:gap-14 md:pb-20">
      <PageContainer className="pb-0">
        <HomeHero home={home} diagramId="home-diagram-title" />
      </PageContainer>
      <section className="flex flex-col gap-6">
        <div className="mx-auto w-full max-w-[1200px] px-4 md:px-6">
          <h2 id="home-diagram-title" className="type-section-heading scroll-mt-24">
            {UI_TEXT.diagramTitle}
          </h2>
        </div>
        <HomeDiagram />
      </section>
    </div>
  );
}
