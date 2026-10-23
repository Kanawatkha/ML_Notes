import type { ReactNode } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { cn } from '@/lib/cn';
import './illustrations.css';

type IllustrationFrameProps = {
  /** `topic` is the darker translucent card of a topic hero; `home` the green card of Home. */
  tone: 'topic' | 'home';
  children: ReactNode;
};

const TONES = {
  topic: 'rounded-md border border-on-dark/15 bg-cohere-black/25',
  home: 'rounded-lg bg-deep-green text-on-dark',
} as const;

/**
 * The card around an illustration and the 400 x 300 drawing area inside it. The drawing is purely
 * decorative (the page text says everything it shows), so it is hidden from assistive technology.
 * It plays once, when the card scrolls into view.
 */
export function IllustrationFrame({ tone, children }: IllustrationFrameProps) {
  const reveal = useReveal('parts');
  return (
    <div {...reveal} className={cn('illus p-4 md:p-6', TONES[tone])}>
      <svg
        viewBox="0 0 400 300"
        aria-hidden="true"
        focusable="false"
        className="mx-auto block h-auto max-h-[min(280px,45dvh)] w-full"
      >
        {children}
      </svg>
    </div>
  );
}
