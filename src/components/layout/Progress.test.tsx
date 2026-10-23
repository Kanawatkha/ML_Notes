import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BackToTop } from '@/components/layout/BackToTop';
import { ReadingProgress } from '@/components/layout/ReadingProgress';
import { UI_TEXT } from '@/config/site';

function page(scrollY: number, scrollHeight = 4000, innerHeight = 800) {
  Object.defineProperty(window, 'innerHeight', { value: innerHeight, configurable: true });
  Object.defineProperty(window, 'scrollY', { value: scrollY, configurable: true });
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    value: scrollHeight,
    configurable: true,
  });
}

const flushFrame = async () => {
  await act(async () => {
    await new Promise((r) => requestAnimationFrame(() => r(null)));
  });
};

beforeEach(() => page(0));

afterEach(() => vi.restoreAllMocks());

describe('ReadingProgress', () => {
  it('grows with the scroll by writing a transform, and is hidden from assistive technology', async () => {
    const { container } = render(<ReadingProgress />);
    const fill = container.querySelector('[data-progress-fill]') as HTMLElement;
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    page(1600);
    window.dispatchEvent(new Event('scroll'));
    await flushFrame();
    expect(fill.style.transform).toBe('scaleX(0.5)');
    page(3200);
    window.dispatchEvent(new Event('scroll'));
    await flushFrame();
    expect(fill.style.transform).toBe('scaleX(1)');
  });
});

describe('BackToTop', () => {
  it('is hidden and out of the tab order on the first screen, then appears', async () => {
    render(<BackToTop />);
    const button = document.querySelector('button') as HTMLButtonElement;
    await flushFrame();
    expect(button).toHaveAttribute('inert');
    expect(button.className).toContain('opacity-0');

    page(1000);
    window.dispatchEvent(new Event('scroll'));
    await flushFrame();
    expect(button).not.toHaveAttribute('inert');
    expect(screen.getByRole('button', { name: UI_TEXT.backToTop })).toBe(button);
    expect(button.className).toContain('opacity-100');
  });

  it('fills the ring with the page progress and scrolls to the top when pressed', async () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true }) as typeof window.matchMedia;
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    const { container } = render(<BackToTop />);
    page(1600);
    window.dispatchEvent(new Event('scroll'));
    await flushFrame();
    const ring = container.querySelector('circle') as SVGCircleElement;
    const full = 2 * Math.PI * 25;
    expect(Number(ring.style.strokeDashoffset)).toBeCloseTo(full / 2, 3);
    fireEvent.click(screen.getByRole('button', { name: UI_TEXT.backToTop }));
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });
  });
});
