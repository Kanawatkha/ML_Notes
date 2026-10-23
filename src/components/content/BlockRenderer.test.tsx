import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BlockRenderer } from '@/components/content/BlockRenderer';
import { ExampleCard } from '@/components/content/ExampleCard';
import { InlineContent } from '@/components/content/InlineContent';
import type { Block, Cell, Inline } from '@/content/types';

const t = (v: string): Inline => ({ t: 'text', v });
const math = (tex: string, html = `<span class="katex">${tex}</span>`): Inline => ({
  t: 'math',
  tex,
  html,
});
const cell = (c: Inline[], extra: Partial<Cell> = {}): Cell => ({ header: false, c, ...extra });

describe('InlineContent', () => {
  it('renders text, bold, superscript, code and pre-rendered math', () => {
    const { container } = render(
      <p>
        <InlineContent
          nodes={[
            t('a '),
            { t: 'strong', c: [t('b')] },
            { t: 'sup', c: [t('n')] },
            { t: 'code', v: 'c' },
            math('x'),
          ]}
        />
      </p>,
    );
    expect(container.querySelector('strong')).toHaveTextContent('b');
    expect(container.querySelector('sup')).toHaveTextContent('n');
    expect(container.querySelector('code')).toHaveTextContent('c');
    expect(container.querySelector('.katex')).toHaveTextContent('x');
  });
});

describe('BlockRenderer', () => {
  it('renders a paragraph, with the label and step looks only when flagged', () => {
    const { container } = render(
      <>
        <BlockRenderer block={{ t: 'p', c: [t('plain')] }} />
        <BlockRenderer block={{ t: 'p', c: [t('label')], label: true }} />
        <BlockRenderer block={{ t: 'p', c: [t('step')], step: true }} />
      </>,
    );
    const [plain, label, step] = Array.from(container.querySelectorAll('p'));
    expect(plain.className).not.toMatch(/font-medium|border-l-2/);
    expect(label).toHaveClass('font-medium');
    expect(step).toHaveClass('border-l-2');
  });

  it('puts display math in a scroll area', () => {
    const { container } = render(
      <BlockRenderer block={{ t: 'math', tex: 'y', html: '<span class="katex-display">y</span>' }} />,
    );
    expect(container.querySelector('.thin-scroll .katex-display')).toHaveTextContent('y');
  });

  it('renders ordered and unordered lists with nested blocks', () => {
    render(
      <>
        <BlockRenderer
          block={{
            t: 'list',
            ordered: true,
            items: [{ c: [t('first')], children: [{ t: 'p', c: [t('child')] }] }, { c: [t('second')], children: [] }],
          }}
        />
        <BlockRenderer block={{ t: 'list', ordered: false, items: [{ c: [t('dot')], children: [] }] }} />
      </>,
    );
    const lists = screen.getAllByRole('list');
    expect(lists[0].tagName).toBe('OL');
    expect(within(lists[0]).getAllByRole('listitem')).toHaveLength(2);
    expect(within(lists[0]).getByText('child')).toBeInTheDocument();
    expect(lists[1].tagName).toBe('UL');
  });

  it('renders a figure with the label of the SVG as its name', () => {
    render(
      <BlockRenderer
        block={{ t: 'figure', svg: '<svg viewBox="0 0 1 1"><path d="M0 0"/></svg>', label: 'Tree' }}
      />,
    );
    const figure = screen.getByRole('figure', { name: 'Tree' });
    expect(figure.querySelector('svg')).not.toBeNull();
  });

  it('renders a note as an aside', () => {
    render(<BlockRenderer block={{ t: 'note', c: [{ t: 'p', c: [t('careful')] }] }} />);
    expect(screen.getByRole('complementary')).toHaveTextContent('careful');
  });
});

describe('TableBlock', () => {
  const table: Block = {
    t: 'table',
    head: [[cell([], { header: true }), cell([t('c₁')], { header: true }), cell([math('D_{41}')], { header: true })]],
    rows: [
      [cell([t('x₁')], { header: true }), cell([t('0')]), cell([])],
      [cell([t('x₂')], { header: true }), cell([t('3')], { align: 'l' }), cell([t('1')])],
    ],
  };

  it('uses column headers, row headers and plain cells', () => {
    render(<BlockRenderer block={table} />);
    expect(screen.getAllByRole('columnheader').map((h) => h.textContent)).toEqual(['c₁', 'D_{41}D sub 41']);
    expect(screen.getAllByRole('rowheader').map((h) => h.textContent)).toEqual(['x₁', 'x₂']);
    // the empty corner cell is a plain cell, not a column label
    expect(screen.getAllByRole('cell').length).toBe(1 + 4);
  });

  it('gives a header cell that holds only a formula a readable name', () => {
    render(<BlockRenderer block={table} />);
    expect(screen.getByRole('columnheader', { name: 'D sub 41' })).toBeInTheDocument();
  });

  it('keeps the alignment of a cell and keeps empty body cells', () => {
    render(<BlockRenderer block={table} />);
    expect(screen.getByText('3')).toHaveClass('text-left');
    expect(screen.getByText('0')).toHaveClass('text-center');
    expect(screen.getAllByRole('row')).toHaveLength(3);
  });

  it('omits the head when the table has none', () => {
    const { container } = render(
      <BlockRenderer block={{ t: 'table', head: [], rows: [[cell([t('only')])]] }} />,
    );
    expect(container.querySelector('thead')).toBeNull();
  });
});

describe('ExampleCard', () => {
  const block = {
    t: 'example' as const,
    id: 't/1/ex1',
    index: 3,
    title: [t('ตัวอย่างโจทย์ 2')],
    problem: [{ t: 'p' as const, c: [t('the problem')] }],
    solLabel: [t('Sol'), { t: 'sup' as const, c: [t('n')] }],
    sol: [{ t: 'p' as const, c: [t('step one')] }],
    ans: [{ t: 'p' as const, c: [{ t: 'strong' as const, c: [t('Ans')] }, t(' 42')] }],
  };

  it('shows the EX chip, the title, the problem, the Sol label, the steps and the Ans, in that order', () => {
    const { container } = render(<ExampleCard block={block} level={3} />);
    const article = container.querySelector('article') as HTMLElement;
    expect(article).toHaveAttribute('id', 't/1/ex1');
    expect(screen.getByText('EX 03')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'ตัวอย่างโจทย์ 2' })).toBeInTheDocument();
    const text = (article.textContent ?? '').replace(/\s+/g, '');
    const order = ['theproblem', 'Soln', 'stepone', 'Ans42'].map((s) => text.indexOf(s));
    expect(order.every((i) => i >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
  });

  it('uses heading level 4 under a sub-topic and has no Ans strip when there is no Ans', () => {
    const { container } = render(<ExampleCard block={{ ...block, ans: [] }} level={4} />);
    expect(screen.getByRole('heading', { level: 4 })).toBeInTheDocument();
    expect(container.querySelector('.bg-pale-green')).toBeNull();
  });
});
