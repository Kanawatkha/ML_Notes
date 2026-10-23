import { CountUp } from '@/components/motion/CountUp';
import { cn } from '@/lib/cn';

type Stat = { value: number | string; label: string };

type StatRowProps = { stats: readonly Stat[]; tone?: 'light' | 'dark'; className?: string };

/**
 * A row of numbers with their Thai labels, separated by thin vertical rules. The numbers come from
 * the content data (never typed by hand). `dark` is for use on a coloured band.
 */
export function StatRow({ stats, tone = 'light', className }: StatRowProps) {
  const dark = tone === 'dark';
  return (
    <dl className={cn('flex flex-wrap gap-y-4', dark ? 'text-on-dark' : 'text-ink', className)}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={cn(
            'flex flex-col gap-0.5 border-l pr-6 pl-4 first:border-l-0 first:pl-0 sm:pr-10 sm:pl-6',
            dark ? 'border-on-dark/25' : 'border-hairline',
          )}
        >
          <dd className="type-card-heading tabular">
            {typeof stat.value === 'number' ? <CountUp value={stat.value} /> : stat.value}
          </dd>
          <dt className={cn('type-caption', dark ? 'text-on-dark/80' : 'text-body-muted')}>
            {stat.label}
          </dt>
        </div>
      ))}
    </dl>
  );
}
