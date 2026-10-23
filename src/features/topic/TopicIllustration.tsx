import { ClassificationIllustration } from '@/components/illustrations/ClassificationIllustration';
import { ClusteringIllustration } from '@/components/illustrations/ClusteringIllustration';
import { RegressionIllustration } from '@/components/illustrations/RegressionIllustration';
import type { PageId } from '@/config/site';

/** The drawing in the hero of a topic page: one per topic (UI-SPEC.md A4). */
export function TopicIllustration({ pageId }: { pageId: PageId }) {
  switch (pageId) {
    case 'regression':
      return <RegressionIllustration />;
    case 'classification':
      return <ClassificationIllustration />;
    case 'clustering':
      return <ClusteringIllustration />;
  }
}
