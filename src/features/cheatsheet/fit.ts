/** Smallest and largest font size (px) a side may take. The sheet is laid out at real size (96 dpi). */
export const FIT_MIN_PX = 2.5;
export const FIT_MAX_PX = 14;

const STEPS = 16;

/**
 * True when the content of a side does not fit: it flowed into an extra column to the right, ran
 * below the page, or a formula is wider than the box that holds it.
 */
export function overflows(page: HTMLElement): boolean {
  if (page.scrollHeight > page.clientHeight + 0.5 || page.scrollWidth > page.clientWidth + 0.5) {
    return true;
  }
  for (const formula of page.querySelectorAll<HTMLElement>('.katex-display > .katex')) {
    const room = formula.parentElement?.clientWidth ?? 0;
    if (room > 0 && formula.scrollWidth > room + 0.5) return true;
  }
  return false;
}

/**
 * Gives `page` the largest font size at which its content still fits (a binary search between
 * FIT_MIN_PX and FIT_MAX_PX), so the side is as full as it can be. Returns the size in px.
 */
export function fitPage(page: HTMLElement): number {
  let lo = FIT_MIN_PX;
  let hi = FIT_MAX_PX;
  for (let i = 0; i < STEPS; i++) {
    const mid = (lo + hi) / 2;
    page.style.fontSize = `${mid}px`;
    if (overflows(page)) hi = mid;
    else lo = mid;
  }
  page.style.fontSize = `${lo}px`;
  return lo;
}
