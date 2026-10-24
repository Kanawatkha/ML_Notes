import { HomeIllustration } from '@/components/illustrations/HomeIllustration';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { StatRow } from '@/components/ui/StatRow';
import { SITE_NAME, UI_TEXT } from '@/config/site';
import type { HomeFile } from '@/content/types';
import { prefersReducedMotion } from '@/lib/motion';

type HomeHeroProps = { home: HomeFile | null; diagramId: string };

/**
 * The top of Home (UI-SPEC.md section 3): the course label, the site name as the one oversized
 * headline of the page, the lead, three numbers counted from the content, and the green card with
 * the Home plot. The numbers appear when the home file has arrived (a few hundred bytes); the text
 * is painted at once. On phones a link scrolls down to the diagram.
 */
export function HomeHero({ home, diagramId }: HomeHeroProps) {
  const toDiagram = () =>
    document
      .getElementById(diagramId)
      ?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  return (
    <section
      aria-labelledby="home-title"
      className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
    >
      <div className="flex min-w-0 flex-col gap-6">
        <Chip>{UI_TEXT.courseLabel}</Chip>
        <h1 id="home-title" className="type-hero title-rise">
          {SITE_NAME}
        </h1>
        <p className="type-body-lg lead-rise max-w-[640px]">{UI_TEXT.homeLead}</p>
        {home ? (
          <StatRow
            stats={[
              { value: home.stats.topics, label: UI_TEXT.statTopics },
              { value: home.stats.leaves, label: UI_TEXT.statLeaves },
              { value: home.stats.examples, label: UI_TEXT.statExamples },
              { value: home.stats.exercises, label: UI_TEXT.statExercises },
            ]}
          />
        ) : (
          <div className="h-[72px]" aria-hidden="true" />
        )}
        <Button variant="secondary" onClick={toDiagram} className="self-start md:hidden">
          {UI_TEXT.diagramTitle} ↓
        </Button>
      </div>
      <HomeIllustration />
    </section>
  );
}
