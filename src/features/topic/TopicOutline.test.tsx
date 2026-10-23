import { act, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PAGES } from '@/config/site';
import type { Block, Inline } from '@/content/types';
import { counts, fileOf } from '@/test/content';
import { FIRST_UNITS, TopicOutline } from './TopicOutline';
import { buildUnits, OVERVIEW_ID } from './units';

function countMath(blocks: Block[]): number {
  const inline = (nodes: Inline[]): number =>
    nodes.reduce(
      (n, i) => n + (i.t === 'math' ? 1 : i.t === 'strong' || i.t === 'sup' ? inline(i.c) : 0),
      0,
    );
  return blocks.reduce((n, b) => n + (b.t === 'p' ? inline(b.c) : 0), 0);
}

describe('buildUnits', () => {
  it('lists the overview, each section and sub-topic, and their examples in source order', () => {
    expect(buildUnits(fileOf('classification')).map((u) => u.id)).toEqual([
      'classification/1',
      'classification/1.1',
      'classification/1.1/ex1',
      'classification/1.2',
      'classification/1.2/ex1',
      'classification/1.2/ex2',
      'classification/1.3',
      'classification/1.3/ex1',
      'classification/1.3/ex2',
      'classification/1.4',
      'classification/1.4/ex1',
      'classification/2',
      'classification/2/ex1',
      'classification/2/ex2',
      'classification/3',
      'classification/3/ex1',
      'classification/4',
      'classification/4/ex1',
      'classification/4/ex2',
      'classification/4/ex3',
    ]);
  });

  it('starts with the overview panel only for pages that have one', () => {
    expect(buildUnits(fileOf('regression'))[0].id).toBe(OVERVIEW_ID('regression'));
    expect(buildUnits(fileOf('clustering'))[0].id).toBe('clustering/1');
  });
});

describe.each(PAGES.map((p) => p.id))('the %s page, everything mounted', (id) => {
  const file = fileOf(id);
  const c = counts[id];

  it('renders every section, sub-topic and example, with the headings of the Markdown', () => {
    const { container } = render(<TopicOutline file={file} />);
    expect(container.querySelectorAll('section[id]').length).toBe(
      c.sections + c.subtopics + (file.root.explain.length > 0 ? 1 : 0),
    );
    expect(container.querySelectorAll('article').length).toBe(c.examples);
    for (const n of [
      file.root,
      ...file.root.children,
      ...file.root.children.flatMap((s) => s.children),
    ]) {
      if (n.kind === 'page') continue;
      expect(container.querySelector(`[id="${n.id}"]`), n.id).not.toBeNull();
    }
  });

  it('renders every table, figure and formula of the content', () => {
    const { container } = render(<TopicOutline file={file} />);
    expect(container.querySelectorAll('table').length).toBe(c.tables);
    expect(container.querySelectorAll('figure').length).toBe(c.figures);
    // the lead paragraph belongs to the hero, which is not part of the outline
    const leadFormulas = countMath(file.root.lead);
    expect(container.querySelectorAll('.katex').length).toBe(
      c.displayFormulas + c.inlineFormulas - leadFormulas,
    );
  });

  it('keeps the heading order without skipped levels', () => {
    const { container } = render(<TopicOutline file={file} />);
    const levels = Array.from(container.querySelectorAll('h2,h3,h4')).map((h) =>
      Number(h.tagName[1]),
    );
    for (let i = 1; i < levels.length; i++)
      expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
    expect(levels[0]).toBe(2);
  });

  it('gives every example card an Ans strip', () => {
    const { container } = render(<TopicOutline file={file} />);
    for (const article of container.querySelectorAll('article')) {
      expect(article.querySelector('.bg-pale-green'), article.id).not.toBeNull();
    }
  });
});

describe('staged mounting', () => {
  let observed: { cb: IntersectionObserverCallback; el: Element }[] = [];

  class FakeObserver {
    constructor(private cb: IntersectionObserverCallback) {}
    observe(el: Element) {
      observed.push({ cb: this.cb, el });
    }
    disconnect() {
      observed = observed.filter((o) => o.cb !== this.cb);
    }
    unobserve() {}
    takeRecords = () => [];
  }

  afterEach(() => {
    vi.unstubAllGlobals();
    observed = [];
  });

  const file = fileOf('classification');
  const total = buildUnits(file).length;

  it('mounts the first units and holds the place of the rest, with their ids', () => {
    vi.stubGlobal('IntersectionObserver', FakeObserver);
    const { container } = render(<TopicOutline file={file} />);
    const ids = buildUnits(file).map((u) => u.id);
    for (const id of ids) expect(container.querySelector(`[id="${id}"]`), id).not.toBeNull();
    const placeholders = container.querySelectorAll('div[aria-hidden="true"][id]');
    expect(placeholders.length).toBe(total - FIRST_UNITS);
    expect(placeholders[0]).toHaveAttribute('id', ids[FIRST_UNITS]);
    expect((placeholders[0] as HTMLElement).style.minHeight).toMatch(/px$/);
  });

  it('mounts a unit, and the one after it, when its placeholder comes near', () => {
    vi.stubGlobal('IntersectionObserver', FakeObserver);
    const { container } = render(<TopicOutline file={file} />);
    const before = container.querySelectorAll('div[aria-hidden="true"][id]').length;
    const entry = observed.find((o) => o.el.id === buildUnits(file)[FIRST_UNITS].id);
    expect(entry).toBeDefined();
    act(() =>
      entry!.cb(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      ),
    );
    expect(container.querySelectorAll('div[aria-hidden="true"][id]').length).toBe(before - 2);
  });

  it('mounts everything at once when asked (a jump to a part that may still be a placeholder)', () => {
    vi.stubGlobal('IntersectionObserver', FakeObserver);
    const { container } = render(<TopicOutline file={file} mountAll />);
    expect(container.querySelectorAll('div[aria-hidden="true"][id]').length).toBe(0);
  });
});
