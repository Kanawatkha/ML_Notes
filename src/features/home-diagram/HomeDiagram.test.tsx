import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PAGES, UI_TEXT } from '@/config/site';
import * as loaders from '@/content/loaders';
import { fileOf } from '@/test/content';
import { HomeDiagram } from './HomeDiagram';
import { leavesOf, pageNodes, type DNode } from './model';

vi.mock('@/content/loaders', async () => {
  const { fileOf: file, homeFile } = await import('@/test/content');
  return {
    loadHome: vi.fn(() => Promise.resolve(homeFile)),
    loadPage: vi.fn((id: Parameters<typeof file>[0]) => Promise.resolve(file(id))),
    loadMeta: vi.fn(),
  };
});

function Location() {
  const { search } = useLocation();
  return <output data-testid="search">{decodeURIComponent(search)}</output>;
}

function renderDiagram(query = '') {
  return render(
    <MemoryRouter initialEntries={[`/${query}`]}>
      <HomeDiagram />
      <Location />
    </MemoryRouter>,
  );
}

const node = (id: string) => document.querySelector<HTMLElement>(`[data-node-id="${id}"]`);
const press = (id: string) => fireEvent.click(node(id) as HTMLElement);
const search = () => screen.getByTestId('search').textContent;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('opening the diagram', () => {
  it('starts closed with the Midterm button and a hint, and opens to the topics', async () => {
    renderDiagram();
    const root = await screen.findByRole('button', { name: 'Midterm' });
    expect(root).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText(UI_TEXT.diagramHint)).toBeInTheDocument();
    expect(screen.queryByText('Regression')).toBeNull();

    fireEvent.click(root);
    expect(root).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('region', { name: UI_TEXT.diagramTitle })).toBeInTheDocument();
    for (const page of PAGES) expect(await screen.findByText(page.label)).toBeInTheDocument();
    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument();
  });

  it('shows the topics with their tag and the count of their nodes', async () => {
    renderDiagram('?p=');
    const regression = await waitFor(() => {
      const el = node('regression');
      expect(el).not.toBeNull();
      return el as HTMLElement;
    });
    expect(regression).toHaveTextContent('Supervised');
    expect(regression).toHaveTextContent('4 หัวข้อ');
    expect(node('clustering')).toHaveTextContent('Unsupervised');
  });
});

describe('walking down to a leaf and its examples', () => {
  it('opens a topic, a group section, a sub-topic and its examples, one open node per column', async () => {
    renderDiagram('?p=');
    await waitFor(() => expect(node('classification')).not.toBeNull());

    press('classification');
    await waitFor(() => expect(node('classification/1')).not.toBeNull());
    expect(node('classification')).toHaveAttribute('aria-expanded', 'true');

    press('classification/1');
    await waitFor(() => expect(node('classification/1.2')).not.toBeNull());
    expect(node('classification/1/overview')).not.toBeNull();

    press('classification/1.2');
    const block = await screen.findByRole('heading', { level: 2, name: 'Cosine' });
    expect(block.closest('article')).toHaveTextContent('Classification / 1 K-NN / 1.2 Cosine');

    // the other nodes of a column are replaced, not stacked
    press('classification/2');
    await waitFor(() =>
      expect(screen.queryByRole('heading', { level: 2, name: 'Cosine' })).toBeNull(),
    );
    expect(node('classification/1')).toHaveAttribute('aria-expanded', 'false');
    expect(node('classification/2')).toHaveAttribute('aria-expanded', 'true');
    expect(search()).toBe('?p=classification:2');
  });

  it('shows the examples in a column of their own, never inline, and hides them again', async () => {
    renderDiagram('?p=classification:1,1.2');
    const show = await screen.findByRole('button', { name: `${UI_TEXT.showExamples} (2)` });
    expect(document.querySelectorAll('article[id]')).toHaveLength(0);
    expect(show).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(show);
    const examples = await screen.findByRole('region', { name: /ตัวอย่าง Cosine/ });
    expect(within(examples).getAllByRole('article')).toHaveLength(2);
    expect(within(examples).getByText('EX 02')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: UI_TEXT.hideExamples })).toHaveAttribute(
      'aria-controls',
      examples.parentElement?.id,
    );
    expect(search()).toBe('?p=classification:1,1.2&x=1');

    fireEvent.click(screen.getByRole('button', { name: UI_TEXT.hideExamples }));
    await waitFor(() =>
      expect(screen.queryByRole('region', { name: /ตัวอย่าง Cosine/ })).toBeNull(),
    );
  });

  it('links each block to the same part of the topic page, and has no example button without examples', async () => {
    renderDiagram('?p=classification:1,1/overview');
    const link = await screen.findByRole('link', { name: UI_TEXT.readOnPage });
    expect(link).toHaveAttribute('href', '/classification?s=1');
    expect(screen.queryByRole('button', { name: new RegExp(UI_TEXT.showExamples) })).toBeNull();
  });

  it('restores the whole state from the address, including the example column', async () => {
    renderDiagram('?p=classification:2&x=1');
    expect(
      await screen.findByRole('heading', { level: 2, name: 'Perceptron' }),
    ).toBeInTheDocument();
    expect(await screen.findByRole('region', { name: /ตัวอย่าง Perceptron/ })).toBeInTheDocument();
    expect(node('classification/2')).toHaveAttribute('aria-expanded', 'true');
  });
});

describe('keyboard and announcements', () => {
  it('closes the deepest open thing on Esc and puts focus back on its control', async () => {
    renderDiagram('?p=classification:2&x=1');
    await screen.findByRole('region', { name: /ตัวอย่าง Perceptron/ });
    const region = screen.getByRole('region', { name: UI_TEXT.diagramTitle });

    fireEvent.keyDown(region, { key: 'Escape' });
    await waitFor(() =>
      expect(screen.queryByRole('region', { name: /ตัวอย่าง Perceptron/ })).toBeNull(),
    );
    expect(node('ex:classification/2')).toHaveFocus();

    fireEvent.keyDown(region, { key: 'Escape' });
    await waitFor(() =>
      expect(screen.queryByRole('heading', { level: 2, name: 'Perceptron' })).toBeNull(),
    );
    expect(node('classification/2')).toHaveFocus();
    expect(search()).toBe('?p=classification');

    fireEvent.keyDown(region, { key: 'Escape' });
    expect(node('classification')).toHaveFocus();
    fireEvent.keyDown(region, { key: 'Escape' });
    expect(node('root')).toHaveFocus();
    expect(search()).toBe('');
  });

  it('moves between nodes with the arrow keys', async () => {
    renderDiagram('?p=classification');
    await waitFor(() => expect(node('classification/2')).not.toBeNull());
    (node('classification/1') as HTMLElement).focus();
    fireEvent.keyDown(node('classification/1') as HTMLElement, { key: 'ArrowDown' });
    expect(node('classification/2')).toHaveFocus();
    fireEvent.keyDown(node('classification/2') as HTMLElement, { key: 'ArrowUp' });
    expect(node('classification/1')).toHaveFocus();
    fireEvent.keyDown(node('classification/1') as HTMLElement, { key: 'ArrowLeft' });
    expect(node('classification')).toHaveFocus();
  });

  it('announces what was opened or closed in a polite live region', async () => {
    renderDiagram('?p=');
    await waitFor(() => expect(node('regression')).not.toBeNull());
    press('regression');
    const live = document.querySelector('[aria-live="polite"]') as HTMLElement;
    expect(live).toHaveTextContent(`${UI_TEXT.opened} Regression`);
    press('regression');
    expect(live).toHaveTextContent(`${UI_TEXT.closed} Regression`);
  });
});

describe('loading problems', () => {
  it('shows an error column with a retry when a page cannot be loaded, then the sections', async () => {
    vi.mocked(loaders.loadPage).mockRejectedValueOnce(new Error('offline'));
    renderDiagram('?p=');
    await waitFor(() => expect(node('clustering')).not.toBeNull());
    press('clustering');
    const retry = await screen.findByRole('button', { name: UI_TEXT.retry });
    expect(screen.getByRole('alert')).toHaveTextContent(UI_TEXT.loadError);
    fireEvent.click(retry);
    await waitFor(() => expect(node('clustering/1')).not.toBeNull());
  });
});

/** Ids from the topic down to a leaf, as the diagram path. */
function pathTo(nodes: DNode[], id: string, trail: string[] = []): string[] | null {
  for (const n of nodes) {
    if (n.id === id) return [...trail, n.id];
    const found = pathTo(n.children, id, [...trail, n.id]);
    if (found) return found;
  }
  return null;
}

describe.each(PAGES.map((p) => p.id))('every leaf of %s opens its block', (id) => {
  const nodes = pageNodes(fileOf(id));
  const leaves = leavesOf(nodes);

  it.each(leaves.map((l) => [l.id, l] as const))('%s', async (_leafId, leaf) => {
    const path = pathTo(nodes, leaf.id) as string[];
    const segments = path.map((p) => p.slice(id.length + 1)).join(',');
    const { unmount } = renderDiagram(`?p=${id}:${segments}${leaf.examples.length ? '&x=1' : ''}`);
    const block = await waitFor(
      () => {
        const el = document.querySelector('article h2');
        expect(el).not.toBeNull();
        return el as HTMLElement;
      },
      { timeout: 5000 },
    );
    expect(block).toHaveTextContent(
      leaf.title
        .map((t) => ('v' in t ? t.v : ''))
        .join('')
        .trim() || /./,
    );
    const article = block.closest('article') as HTMLElement;
    expect(within(article).getByRole('link', { name: UI_TEXT.readOnPage })).toHaveAttribute(
      'href',
      `/${id}${leaf.read ? `?s=${leaf.read}` : ''}`,
    );
    if (leaf.examples.length > 0) {
      const examples = await screen.findByRole('region', { name: new RegExp(UI_TEXT.examples) });
      expect(within(examples).getAllByRole('article')).toHaveLength(leaf.examples.length);
    }
    unmount();
  });
});
