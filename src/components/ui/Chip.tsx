import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type ChipTone = 'default' | 'coral' | 'on-dark';

const TONES: Record<ChipTone, string> = {
  default: 'border-hairline text-body-muted',
  coral: 'border-coral text-ink',
  'on-dark': 'border-on-dark/30 text-on-dark/80',
};

type ChipProps = { tone?: ChipTone; className?: string; children: ReactNode };

/**
 * Small mono tag (SUPERVISED, EX 03, 1.2). Latin only: the style is uppercase mono, which never
 * applies to Thai text. The coral tone is an outline next to ink text, never coral text.
 */
export function Chip({ tone = 'default', className, children }: ChipProps) {
  return (
    <span
      className={cn(
        'type-mono inline-flex w-fit items-center rounded-sm border px-2 py-0.5 whitespace-nowrap',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
