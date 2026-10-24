import { afterEach, describe, expect, it, vi } from 'vitest';
import { isGliding, jumpTo } from './jumpTo';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('jumpTo', () => {
  it('scrolls to the element (instantly under reduced motion) and focuses it without touching the URL', () => {
    document.body.innerHTML = '<h2 id="q3" tabindex="-1">ข้อ 3</h2>';
    const el = document.getElementById('q3') as HTMLElement;
    el.scrollIntoView = vi.fn();
    window.matchMedia = vi.fn().mockReturnValue({ matches: true }) as typeof window.matchMedia;
    const hash = window.location.hash;

    expect(jumpTo('q3')).toBe(true);
    expect(el.scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' });
    expect(el).toHaveFocus();
    expect(window.location.hash).toBe(hash);
  });

  it('glides with scrollTo instead of the browser smooth scroll unless the visitor asked for less motion', () => {
    vi.useFakeTimers();
    try {
      document.body.innerHTML = '<h2 id="q3" tabindex="-1">ข้อ 3</h2>';
      const el = document.getElementById('q3') as HTMLElement;
      el.scrollIntoView = vi.fn();
      window.scrollTo = vi.fn() as typeof window.scrollTo;
      window.matchMedia = vi.fn().mockReturnValue({ matches: false }) as typeof window.matchMedia;
      jumpTo('q3');
      expect(el.scrollIntoView).not.toHaveBeenCalled();
      vi.advanceTimersByTime(100);
      expect(window.scrollTo).toHaveBeenCalledWith(
        expect.objectContaining({ behavior: 'instant' }),
      );
    } finally {
      vi.useRealTimers();
    }
  });

  it('marks the arrival for a moment, and restarts the mark when the same target is chosen again', () => {
    vi.useFakeTimers();
    try {
      document.body.innerHTML = '<h2 id="q3" tabindex="-1">ข้อ 3</h2>';
      const el = document.getElementById('q3') as HTMLElement;
      el.scrollIntoView = vi.fn();
      window.scrollTo = vi.fn() as typeof window.scrollTo;
      window.matchMedia = vi.fn().mockReturnValue({ matches: false }) as typeof window.matchMedia;

      jumpTo('q3');
      expect(el).toHaveAttribute('data-arrive');
      vi.advanceTimersByTime(1000);
      expect(el).toHaveAttribute('data-arrive');

      jumpTo('q3'); // chosen again: the earlier timer must not end the new mark
      vi.advanceTimersByTime(900);
      expect(el).toHaveAttribute('data-arrive');
      vi.advanceTimersByTime(1000);
      expect(el).not.toHaveAttribute('data-arrive');
    } finally {
      vi.useRealTimers();
    }
  });

  it('returns false when there is no such element', () => {
    expect(jumpTo('nope')).toBe(false);
  });
});

describe('jumpTo glide', () => {
  /** A heading that sits `gap` px below its scroll margin until the page has scrolled by `gap`. */
  function heading(gap: number, drift = 0) {
    document.body.innerHTML = '<h2 id="i1" tabindex="-1" style="scroll-margin-top: 96px">x</h2>';
    const el = document.getElementById('i1') as HTMLElement;
    el.scrollIntoView = vi.fn();
    let y = 0;
    window.scrollTo = vi.fn((o: ScrollToOptions) => {
      y = o.top ?? 0;
    }) as typeof window.scrollTo;
    Object.defineProperty(window, 'scrollY', { configurable: true, get: () => y });
    // the target moves by `drift` once the glide is half way, like cards that took their real size
    el.getBoundingClientRect = () => ({ top: 96 + gap + (y > gap / 2 ? drift : 0) - y }) as DOMRect;
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      scrollMarginTop: '96px',
    } as CSSStyleDeclaration);
    return { el, position: () => y };
  }

  const motion = (reduced: boolean) => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: reduced }) as typeof window.matchMedia;
  };

  it('lands exactly on the target, even when the target moved on the way', () => {
    vi.useFakeTimers();
    try {
      motion(false);
      const { position } = heading(3000, 400);
      jumpTo('i1');
      vi.advanceTimersByTime(2000);
      expect(position()).toBe(3400);
    } finally {
      vi.useRealTimers();
    }
  });

  it('never moves backwards on the way down', () => {
    vi.useFakeTimers();
    try {
      motion(false);
      const { position } = heading(2000);
      jumpTo('i1');
      let last = 0;
      for (let t = 0; t < 1000; t += 16) {
        vi.advanceTimersByTime(16);
        expect(position()).toBeGreaterThanOrEqual(last);
        last = position();
      }
    } finally {
      vi.useRealTimers();
    }
  });

  it('takes longer for a long jump than a short one, and is capped', () => {
    vi.useFakeTimers();
    try {
      motion(false);
      const short = heading(300);
      jumpTo('i1');
      vi.advanceTimersByTime(300);
      expect(short.position()).toBeLessThan(300);
      vi.advanceTimersByTime(300);
      expect(short.position()).toBe(300);

      const long = heading(40000);
      jumpTo('i1');
      vi.advanceTimersByTime(950);
      expect(long.position()).toBe(40000);
    } finally {
      vi.useRealTimers();
    }
  });

  it('hands the scroll back to the reader at once when they use the wheel', () => {
    vi.useFakeTimers();
    try {
      motion(false);
      const { position } = heading(3000);
      jumpTo('i1');
      vi.advanceTimersByTime(200);
      const stopped = position();
      expect(stopped).toBeGreaterThan(0);
      window.dispatchEvent(new Event('wheel'));
      vi.advanceTimersByTime(1000);
      expect(position()).toBe(stopped);
    } finally {
      vi.useRealTimers();
    }
  });

  it('says when it has ended with a scrollend event, and is gliding until then', () => {
    vi.useFakeTimers();
    try {
      motion(false);
      heading(500);
      const ended = vi.fn();
      window.addEventListener('scrollend', ended);
      jumpTo('i1');
      expect(isGliding()).toBe(true);
      vi.advanceTimersByTime(1000);
      expect(isGliding()).toBe(false);
      expect(ended).toHaveBeenCalledTimes(1);
      window.removeEventListener('scrollend', ended);
    } finally {
      vi.useRealTimers();
    }
  });

  it('under reduced motion jumps at once, checks soon after, and gives up after three corrections', () => {
    vi.useFakeTimers();
    try {
      motion(true);
      const { el } = heading(500);
      el.getBoundingClientRect = () => ({ top: 500 }) as DOMRect; // never gets right
      jumpTo('i1');
      expect(el.scrollIntoView).toHaveBeenCalledTimes(1);
      vi.advanceTimersByTime(130);
      expect(el.scrollIntoView).toHaveBeenCalledTimes(2);
      vi.advanceTimersByTime(5000);
      expect(el.scrollIntoView).toHaveBeenCalledTimes(4); // the jump plus three corrections
    } finally {
      vi.useRealTimers();
    }
  });
});
