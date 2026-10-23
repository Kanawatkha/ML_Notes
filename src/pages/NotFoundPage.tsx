import { PageContainer } from '@/components/layout/PageContainer';
import { ButtonLink } from '@/components/ui/Button';
import { HOME_ROUTE, UI_TEXT } from '@/config/site';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function NotFoundPage() {
  usePageTitle(UI_TEXT.notFound);
  return (
    <PageContainer className="flex flex-col items-center gap-6 py-section text-center">
      <p className="type-section-display text-ink" aria-hidden="true">
        404
      </p>
      <h1 className="type-section-heading">{UI_TEXT.notFound}</h1>
      <ButtonLink to={HOME_ROUTE}>{UI_TEXT.backHome}</ButtonLink>
    </PageContainer>
  );
}
