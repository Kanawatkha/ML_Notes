import { PAGES } from '@/config/site';
import type { HomeFile } from '@/content/types';
import { TopicCard } from './TopicCard';

/** The three topic cards of Home, one per page, in page order. */
export function TopicCards({ home }: { home: HomeFile }) {
  return (
    <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {PAGES.map((page) => {
        const entry = home.pages.find((p) => p.id === page.id);
        return entry ? (
          <li key={page.id} className="flex">
            <TopicCard page={page} entry={entry} />
          </li>
        ) : null;
      })}
    </ul>
  );
}
