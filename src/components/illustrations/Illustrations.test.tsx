import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { resetRevealObserver } from '@/lib/reveal';
import { ClassificationIllustration } from './ClassificationIllustration';
import { ClusteringIllustration } from './ClusteringIllustration';
import { CLASSIFICATION, CLUSTERING, HOME, REGRESSION } from './data';
import { HomeIllustration } from './HomeIllustration';
import { RegressionIllustration } from './RegressionIllustration';

const dots = (el: Element) => el.querySelectorAll('circle.ill-pop, rect');

describe('the four illustrations', () => {
  it.each([
    ['Regression', <RegressionIllustration key="r" />],
    ['Classification', <ClassificationIllustration key="c" />],
    ['Clustering', <ClusteringIllustration key="k" />],
    ['Home', <HomeIllustration key="h" />],
  ])('%s is a decorative drawing hidden from assistive technology', (_name, ui) => {
    const { container } = render(ui);
    const svg = container.querySelector('svg') as SVGSVGElement;
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('viewBox', '0 0 400 300');
    expect(svg.querySelector('title, desc')).toBeNull();
    expect(container.textContent).toBe('');
  });

  it('draws one point per datum, a residual per point and the line', () => {
    const { container } = render(<RegressionIllustration />);
    expect(container.querySelectorAll('circle')).toHaveLength(REGRESSION.points.length);
    expect(container.querySelectorAll('line.ill-ticks')).toHaveLength(REGRESSION.points.length);
    expect(container.querySelectorAll('line.ill-line')).toHaveLength(1);
  });

  it('draws both classes, the query ring, the growing circle and the majority colour', () => {
    const { container } = render(<ClassificationIllustration />);
    expect(container.querySelectorAll('.ill-pop.fill-on-dark')).toHaveLength(
      CLASSIFICATION.a.length,
    );
    expect(container.querySelectorAll('.ill-pop.fill-coral-soft')).toHaveLength(
      CLASSIFICATION.b.length,
    );
    expect(container.querySelectorAll('.ill-grow')).toHaveLength(1);
    expect(container.querySelector('.ill-fade.fill-on-dark')).not.toBeNull();
  });

  it('draws grey points, two centroids and a recolour layer only where the colour changes', () => {
    const { container } = render(<ClusteringIllustration />);
    expect(container.querySelectorAll('.ill-pop.fill-on-dark\\/40')).toHaveLength(
      CLUSTERING.points.length,
    );
    expect(container.querySelectorAll('rect')).toHaveLength(2);
    const changed = CLUSTERING.assign1.filter((l, i) => l !== CLUSTERING.assign2[i]).length;
    expect(container.querySelectorAll('circle.ill-fade')).toHaveLength(
      CLUSTERING.points.length + changed,
    );
  });

  it('draws the Home plot: the points, a fit that goes, a boundary and two centroids', () => {
    const { container } = render(<HomeIllustration />);
    expect(container.querySelectorAll('circle.ill-pop')).toHaveLength(HOME.points.length);
    expect(container.querySelector('.ill-line')).toHaveAttribute('data-flash');
    expect(container.querySelectorAll('rect')).toHaveLength(2);
    expect(dots(container).length).toBeGreaterThan(HOME.points.length);
  });

  it('gives every animated shape a start delay, and starts none after about 4.5 seconds', () => {
    for (const ui of [
      <RegressionIllustration key="r" />,
      <ClassificationIllustration key="c" />,
      <ClusteringIllustration key="k" />,
      <HomeIllustration key="h" />,
    ]) {
      const { container, unmount } = render(ui);
      const animated = container.querySelectorAll<SVGElement>(
        '.ill-pop, .ill-fade, .ill-line, .ill-ticks, .ill-grow, .ill-move',
      );
      expect(animated.length).toBeGreaterThan(0);
      for (const el of animated) {
        const delay = parseInt(el.style.getPropertyValue('--d'), 10);
        expect(delay).toBeGreaterThanOrEqual(0);
        expect(delay).toBeLessThanOrEqual(4500);
      }
      unmount();
    }
  });
});

describe('when the drawing plays', () => {
  type Callback = (entries: Partial<IntersectionObserverEntry>[]) => void;
  let notify: Callback = () => {};

  beforeEach(() => {
    class FakeObserver {
      constructor(cb: Callback) {
        notify = cb;
      }
      observe = () => {};
      unobserve = () => {};
      disconnect = () => {};
    }
    vi.stubGlobal('IntersectionObserver', FakeObserver);
    window.matchMedia = vi.fn().mockReturnValue({ matches: false }) as typeof window.matchMedia;
    resetRevealObserver();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    resetRevealObserver();
  });

  it('waits until the card is on screen, then plays once', () => {
    const { container } = render(<RegressionIllustration />);
    const frame = container.querySelector('.illus') as HTMLElement;
    expect(frame).not.toHaveAttribute('data-shown');
    notify([{ target: frame, isIntersecting: true }]);
    expect(frame).toHaveAttribute('data-shown');
  });

  it('is complete at once when the visitor asked for less motion', () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true }) as typeof window.matchMedia;
    const { container } = render(<HomeIllustration />);
    expect(container.querySelector('.illus')).toHaveAttribute('data-shown');
  });
});
