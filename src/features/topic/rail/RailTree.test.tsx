import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { fileOf } from '@/test/content';
import { OVERVIEW_ID } from '../units';
import { ProgressRing } from './ProgressRing';
import { RailTree } from './RailTree';
import { buildRailTree, flattenRail, positionOf } from './treeModel';

const entries = buildRailTree(fileOf('classification'), OVERVIEW_ID('classification'));
const find = (id: string) => flattenRail(entries).find((e) => e.id === id)!;

function renderTree(entryId: string, progress: Record<string, number> = {}, onSelect = vi.fn()) {
  render(
    <RailTree
      entries={entries}
      position={positionOf(find(entryId))}
      progress={progress}
      onSelect={onSelect}
    />,
  );
  return onSelect;
}

describe('RailTree', () => {
  /** A folded part is inert (out of the tab order and invisible to assistive technology). */
  const folded = (el: HTMLElement) => el.closest('[inert]') !== null;
  const buttonFor = (id: string) =>
    document.querySelector<HTMLElement>(`[data-rail-id="${id}"]`) as HTMLElement;

  it('shows every section, and opens the content of the section being read only', () => {
    renderTree('classification/2/ex1');
    for (const label of ['K-NN', 'Perceptron', 'FFBP', 'ID3']) {
      expect(screen.getByRole('button', { name: new RegExp(label) })).toBeInTheDocument();
    }
    for (const id of [
      'classification/1',
      'classification/2',
      'classification/3',
      'classification/4',
    ]) {
      expect(folded(buttonFor(id)), id).toBe(false);
    }
    // the Perceptron section is open: its examples are reachable; the K-NN sub-topics are folded
    expect(folded(buttonFor('classification/2/ex1'))).toBe(false);
    expect(folded(buttonFor('classification/2/ex2'))).toBe(false);
    expect(folded(buttonFor('classification/1.1'))).toBe(true);
    expect(folded(buttonFor('classification/3/ex1'))).toBe(true);
  });

  it('opens the sub-topic being read inside an open section', () => {
    renderTree('classification/1.2/ex2');
    expect(folded(buttonFor('classification/1.2'))).toBe(false);
    expect(folded(buttonFor('classification/1.3'))).toBe(false);
    // the examples of the sub-topic being read are open, those of the folded 1.3 are not
    expect(folded(buttonFor('classification/1.2/ex1'))).toBe(false);
    expect(folded(buttonFor('classification/1.2/ex2'))).toBe(false);
    expect(folded(buttonFor('classification/1.3/ex1'))).toBe(true);
    expect(folded(buttonFor('classification/2/ex1'))).toBe(true);
  });

  it('marks the current entry with aria-current and calls onSelect with the id of an entry', () => {
    const onSelect = renderTree('classification/2/ex2');
    const current = screen.getByRole('button', { current: 'location' });
    expect(current).toHaveAttribute('data-rail-id', 'classification/2/ex2');
    fireEvent.click(screen.getByRole('button', { name: /ID3/ }));
    expect(onSelect).toHaveBeenCalledWith('classification/4');
  });

  it('shows the section number, and EX numbers for examples', () => {
    renderTree('classification/2/ex1');
    expect(screen.getByRole('button', { name: /02\s*Perceptron/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /EX 04/ })).toBeInTheDocument();
  });

  it('puts the overview first when the page has one', () => {
    const regression = buildRailTree(fileOf('regression'), OVERVIEW_ID('regression'));
    render(
      <RailTree
        entries={regression}
        position={positionOf(regression[0])}
        progress={{}}
        onSelect={() => {}}
      />,
    );
    const first = screen.getAllByRole('button')[0];
    expect(first).toHaveTextContent('ภาพรวม');
    expect(first).toHaveAttribute('aria-current', 'location');
  });

  it('draws a progress ring for every section but not for the overview or examples', () => {
    const { container } = render(
      <RailTree
        entries={entries}
        position={positionOf(find('classification/1'))}
        progress={{ 'classification/1': 0.5 }}
        onSelect={() => {}}
      />,
    );
    expect(container.querySelectorAll('svg')).toHaveLength(4);
    const nav = within(container);
    expect(nav.getAllByRole('button', { name: /^0\d\s*\S/ }).length).toBeGreaterThan(0);
  });
});

describe('ProgressRing', () => {
  it('fills clockwise with the value and becomes a check when complete', () => {
    const { container, rerender } = render(<ProgressRing value={0} />);
    const dash = (n: number) => {
      rerender(<ProgressRing value={n} />);
      const circles = container.querySelectorAll('circle');
      return Number(circles[1].getAttribute('stroke-dashoffset'));
    };
    const full = dash(0);
    expect(dash(0.5)).toBeCloseTo(full / 2, 5);
    expect(dash(0.99)).toBeLessThan(full / 50);
    rerender(<ProgressRing value={1} />);
    expect(container.querySelector('svg')).toHaveAttribute('data-complete');
    expect(container.querySelector('path')).not.toBeNull();
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
});
