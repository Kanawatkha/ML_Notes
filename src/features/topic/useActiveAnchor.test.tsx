import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fileOf } from '@/test/content';
import { buildRailTree, flattenRail } from './rail/treeModel';
import { OVERVIEW_ID } from './units';
import { REACH_OFFSET, useActiveAnchor } from './useActiveAnchor';

const entries = buildRailTree(fileOf('classification'), OVERVIEW_ID('classification'));
const flat = flattenRail(entries);
const SECTIONS = ['classification/1', 'classification/2', 'classification/3', 'classification/4'];

/** Lays out fake parts: the top of each id in viewport coordinates, and where the page body ends. */
function layout(tops: Record<string, number>, end: number) {
  document.body.innerHTML = '';
  for (const [id, top] of Object.entries(tops)) {
    const el = document.createElement('div');
    el.id = id;
    el.getBoundingClientRect = () => ({ top }) as DOMRect;
    document.body.appendChild(el);
  }
  const endEl = document.createElement('div');
  endEl.id = 'topic-end';
  endEl.getBoundingClientRect = () => ({ top: end }) as DOMRect;
  document.body.appendChild(endEl);
}

/** Entry i of the page sits `gap` px below entry i-1, starting at `first`. */
function stack(first: number, gap: number) {
  return Object.fromEntries(flat.map((e, i) => [e.id, first + i * gap]));
}

const flushFrame = async () => {
  await act(async () => {
    await new Promise((r) => requestAnimationFrame(() => r(null)));
  });
};

beforeEach(() => {
  Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
  Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    value: 4000,
    configurable: true,
  });
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.useRealTimers();
});

describe('useActiveAnchor', () => {
  it('starts at the first entry with no progress', () => {
    layout({}, 9999);
    const { result } = renderHook(() => useActiveAnchor(entries, 'topic-end'));
    expect(result.current.position).toEqual({
      entryId: 'classification/1',
      sectionId: 'classification/1',
    });
    expect(Object.values(result.current.progress)).toEqual([0, 0, 0, 0]);
  });

  it('picks the deepest entry whose top has passed the reading line', async () => {
    // entry i is 100 px below entry i-1, and entry 6 is at the top of the window
    const tops = Object.fromEntries(flat.map((e, i) => [e.id, (i - 6) * 100]));
    layout(tops, 9999);
    const { result } = renderHook(() => useActiveAnchor(entries, 'topic-end'));
    await flushFrame();
    const reached = flat.filter((e) => tops[e.id] <= REACH_OFFSET);
    const deepest = reached[reached.length - 1];
    expect(deepest).toBe(flat[7]);
    expect(result.current.position.entryId).toBe(deepest.id);
    expect(result.current.position.sectionId).toBe(deepest.sectionId);
  });

  it('reports the section and sub-topic of an example inside a sub-topic', async () => {
    const target = 'classification/1.2/ex1';
    const tops = Object.fromEntries(
      flat.map((e) => [e.id, flat.indexOf(e) <= flat.findIndex((x) => x.id === target) ? 0 : 900]),
    );
    layout(tops, 9999);
    const { result } = renderHook(() => useActiveAnchor(entries, 'topic-end'));
    await flushFrame();
    expect(result.current.position).toEqual({
      entryId: target,
      sectionId: 'classification/1',
      subtopicId: 'classification/1.2',
    });
  });

  it('computes how far through each section the reading line is', async () => {
    // section 1 runs from -380 to 620 (reading line at 120): half of it has been read
    const tops: Record<string, number> = stack(2000, 10);
    tops['classification/1'] = -380;
    tops['classification/2'] = 620;
    tops['classification/3'] = 2000;
    tops['classification/4'] = 3000;
    layout(tops, 4000);
    const { result } = renderHook(() => useActiveAnchor(entries, 'topic-end'));
    await flushFrame();
    expect(result.current.progress['classification/1']).toBe(0.5);
    expect(result.current.progress['classification/2']).toBe(0);
    expect(SECTIONS.every((s) => s in result.current.progress)).toBe(true);
  });

  it('marks the last entry and the last section as reached at the bottom of the page', async () => {
    Object.defineProperty(window, 'scrollY', { value: 3200, configurable: true });
    layout(stack(2000, 10), 4000);
    const { result } = renderHook(() => useActiveAnchor(entries, 'topic-end'));
    await flushFrame();
    expect(result.current.position.entryId).toBe(flat[flat.length - 1].id);
    expect(result.current.progress['classification/4']).toBe(1);
  });

  it('sets the position at once on a click and pauses the spy until the scroll has ended', async () => {
    layout(stack(2000, 10), 9999);
    const { result } = renderHook(() => useActiveAnchor(entries, 'topic-end'));
    await flushFrame();
    act(() => result.current.activate('classification/3'));
    expect(result.current.position.entryId).toBe('classification/3');

    // while paused a scroll does not move the highlight back
    window.dispatchEvent(new Event('scroll'));
    await flushFrame();
    expect(result.current.position.entryId).toBe('classification/3');

    // after the scroll has ended the spy reads the page again
    act(() => {
      window.dispatchEvent(new Event('scrollend'));
    });
    await flushFrame();
    expect(result.current.position.entryId).toBe('classification/1');
  });

  it('ignores an unknown id', () => {
    layout({}, 9999);
    const { result } = renderHook(() => useActiveAnchor(entries, 'topic-end'));
    act(() => result.current.activate('nope'));
    expect(result.current.position.entryId).toBe('classification/1');
  });
});
