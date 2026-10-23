import { ScrollArea } from '@/components/content/ScrollArea';

type FigureBlockProps = { svg: string; label: string };

/**
 * Inline SVG figure. The markup is validated at build time (CONTENT-SCHEMA.md section 7) and uses
 * currentColor, so it follows the text color. It sits in a light frame, centered, and never leaves
 * its column. Its accessible name is the aria-label of the SVG.
 */
export function FigureBlock({ svg, label }: FigureBlockProps) {
  return (
    <figure aria-label={label} className="rounded-md bg-card-border p-4 text-ink">
      <ScrollArea className="flex justify-center [&_svg]:h-auto [&_svg]:max-w-full" html={svg} />
    </figure>
  );
}
