import { SITE_NAME } from '@/config/site';

/** Brand mark: three data points on a rising fitted line, the last point coral (UI-SPEC.md section 11). */
export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className="shrink-0 text-ink"
    >
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 25 L28 7" />
        <circle cx="8" cy="21" r="2.75" className="fill-canvas" />
        <circle cx="16" cy="15" r="2.75" className="fill-canvas" />
        <circle cx="24.5" cy="9.5" r="3.25" strokeWidth="1.5" className="fill-coral" />
      </g>
    </svg>
  );
}

/**
 * Mark plus wordmark. "ML" is ink, "Notes" is the secondary grey; below 425 px only "ML" shows
 * next to the mark so the navbar fits.
 */
export function Logo() {
  return (
    <span className="inline-flex items-center gap-2" aria-label={SITE_NAME}>
      <LogoMark />
      <span className="type-card-heading text-[22px] font-medium tracking-[-0.01em] whitespace-nowrap text-ink">
        ML <span className="hidden font-normal text-body-muted min-[425px]:inline">Notes</span>
      </span>
    </span>
  );
}
