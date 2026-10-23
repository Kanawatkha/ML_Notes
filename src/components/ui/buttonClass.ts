import { cn } from '@/lib/cn';

/**
 * The button styles of the design: `primary` (near-black pill), `secondary` (underlined text
 * link) and `outline` (1 px outlined pill for tabs, filters and the share button), plus `on-dark`,
 * a small white pill for the action inside a dark toast.
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'on-dark';

const BASE = 'type-button inline-flex items-center justify-center gap-2 select-none';

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'h-11 rounded-pill bg-primary px-6 text-on-primary active:bg-cohere-black disabled:cursor-not-allowed disabled:bg-hairline disabled:text-body-muted',
  secondary: 'py-2 text-ink underline decoration-1 underline-offset-4',
  'on-dark': 'h-9 rounded-pill bg-on-dark px-4 whitespace-nowrap text-primary',
  outline:
    'min-h-9 rounded-xl border border-primary px-3.5 py-1.5 text-primary active:bg-soft-stone',
};

/** Class list of a button variant, for elements that cannot be a Button (nav links, anchors). */
export function buttonClass(variant: ButtonVariant = 'primary', className?: string): string {
  return cn(BASE, VARIANTS[variant], className);
}
