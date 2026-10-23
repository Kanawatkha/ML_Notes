import type { PAGES } from '@/config/site';

type Band = (typeof PAGES)[number]['band'];

/**
 * Tailwind classes per topic colour. Written out in full so the class scanner finds them.
 * `bg` fills a band, a swatch or a dot; `text` is the text on that band.
 */
export const BAND_CLASS: Record<Band, { bg: string; text: string }> = {
  'dark-navy': { bg: 'bg-dark-navy', text: 'text-on-dark' },
  'deep-green': { bg: 'bg-deep-green', text: 'text-on-dark' },
  primary: { bg: 'bg-primary', text: 'text-on-dark' },
};
