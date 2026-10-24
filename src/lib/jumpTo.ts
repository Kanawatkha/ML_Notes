import { prefersReducedMotion } from '@/lib/motion';

/** How long the underline that marks the arrival stays on the heading (A13). */
const ARRIVE_MS = 1800;

/** Shortest and longest a jump takes; in between it grows with the distance (px). */
const MIN_MS = 380;
const MAX_MS = 900;
/** After an instant jump, the target is put right again up to this many times. */
const SETTLE_TRIES = 3;
const INSTANT_WAIT_MS = 120;
/** The target counts as in place when it is this close to where the scroll margin puts it. */
const SETTLE_TOLERANCE = 4;
/** Input that hands the scroll back to the reader. */
const TAKE_OVER = ['wheel', 'touchstart', 'pointerdown', 'keydown'] as const;

/** The pending timer that ends the mark of each target, so choosing it again restarts the mark. */
const timers = new WeakMap<HTMLElement, number>();

/** Stops the glide that is running, if any. */
let stopGlide: ((announce: boolean) => void) | undefined;

/** True while a glide is running (scrollend events are then not the end of the jump). */
export const isGliding = () => stopGlide !== undefined;

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/** Where the target sits below the position the scroll margin gives it (0 when in place). */
function offsetOf(el: HTMLElement): number {
  const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  return el.getBoundingClientRect().top - margin;
}

/**
 * Scrolls to the target with one eased glide that is driven frame by frame, instead of the
 * browser's smooth scroll. The browser fixes the end point when the scroll starts, so a page whose
 * cards change size on the way ends off target and has to be snapped back (the jerk at the end).
 * Here the end point is read again on every frame, so the glide lands exactly and never snaps.
 * Any wheel, touch, pointer or key press hands the scroll back to the reader at once.
 */
function glide(el: HTMLElement): void {
  stopGlide?.(false);
  const startY = window.scrollY;
  const distance = Math.abs(offsetOf(el));
  const duration = Math.min(MAX_MS, MIN_MS + Math.sqrt(distance) * 9);
  const startAt = performance.now();
  let frame = 0;

  const handBack = () => stop(true);
  const stop = (announce: boolean) => {
    cancelAnimationFrame(frame);
    for (const type of TAKE_OVER) window.removeEventListener(type, handBack);
    if (stopGlide !== stop) return;
    stopGlide = undefined;
    // the glide is made of instant scrolls, so the browser's own scrollend cannot be trusted: say it ended
    if (announce) window.dispatchEvent(new Event('scrollend'));
  };

  const step = (now: number) => {
    if (!el.isConnected) return stop(true);
    const t = Math.min(1, (now - startAt) / duration);
    const endY = window.scrollY + offsetOf(el);
    const top = t >= 1 ? endY : startY + (endY - startY) * easeInOutCubic(t);
    window.scrollTo({ top, behavior: 'instant' });
    if (t >= 1) return stop(true);
    frame = requestAnimationFrame(step);
  };

  stopGlide = stop;
  for (const type of TAKE_OVER) window.addEventListener(type, handBack, { passive: true });
  frame = requestAnimationFrame(step);
}

/**
 * After an instant jump (reduced motion) the cards near the target may take their real size. This
 * looks again a moment later and, if the target is off, puts it right again.
 */
function settle(el: HTMLElement, tries = SETTLE_TRIES): void {
  window.setTimeout(() => {
    if (Math.abs(offsetOf(el)) > SETTLE_TOLERANCE && tries > 0 && el.isConnected) {
      el.scrollIntoView({ behavior: 'auto', block: 'start' });
      settle(el, tries - 1);
    }
  }, INSTANT_WAIT_MS);
}

/**
 * Scrolls to the element with `id` (an eased glide, instant under reduced motion) and moves focus
 * to it, so keyboard and screen reader users arrive where the page does. The URL hash is not
 * touched: it belongs to the router. The target gets `data-arrive` for a moment: motion.css draws
 * an underline under it (A13). Returns false when there is no such element.
 */
export function jumpTo(id: string): boolean {
  const el = document.getElementById(id);
  if (!el) return false;
  if (prefersReducedMotion()) {
    stopGlide?.(false);
    el.scrollIntoView({ behavior: 'auto', block: 'start' });
    settle(el);
  } else {
    glide(el);
  }
  el.focus({ preventScroll: true });
  // restart the underline when the same target is chosen again
  el.removeAttribute('data-arrive');
  void el.offsetWidth;
  el.setAttribute('data-arrive', '');
  window.clearTimeout(timers.get(el));
  timers.set(
    el,
    window.setTimeout(() => el.removeAttribute('data-arrive'), ARRIVE_MS),
  );
  return true;
}
