import { PageContainer } from '@/components/layout/PageContainer';
import { UI_TEXT } from '@/config/site';
import { HomeHero } from '@/features/home/HomeHero';
import { TopicCards } from '@/features/home/TopicCards';
import { HomeDiagram } from '@/features/home-diagram/HomeDiagram';
import { useHome } from '@/hooks/useHome';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function HomePage() {
  usePageTitle();
  const home = useHome();
  return (
    <PageContainer className="flex flex-col gap-16 md:gap-section">
      <HomeHero home={home} diagramId="home-diagram-title" />
      <section className="flex flex-col gap-6">
        <h2 id="home-diagram-title" className="type-section-heading scroll-mt-24">
          {UI_TEXT.diagramTitle}
        </h2>
        <HomeDiagram />
      </section>
      {home ? (
        <section aria-labelledby="home-cards-title" className="flex flex-col gap-6">
          <h2 id="home-cards-title" className="type-section-heading">
            {UI_TEXT.allContent}
          </h2>
          <TopicCards home={home} />
        </section>
      ) : null}
    </PageContainer>
  );
}
