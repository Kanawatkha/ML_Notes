import type { CSSProperties } from 'react';

/** Start delay of one animated shape (read by illustrations.css as `--d`). */
export function at(ms: number, extra: Record<string, string> = {}): CSSProperties {
  return { '--d': `${ms}ms`, ...extra } as CSSProperties;
}

/** Delay of the nth item of a staggered group. */
export function stagger(index: number, from = 0, step = 40): CSSProperties {
  return at(from + index * step);
}
