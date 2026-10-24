import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PAGES, UI_TEXT } from '@/config/site';
import * as loaders from '@/content/loaders';
import { HomeDiagram } from './HomeDiagram';

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
    expect(regression).toHaveTextContent('3 หัวข้อ');
    expect(node('clustering')).toHaveTextContent('Unsupervised');
  });
});

describe('the scope and nothing more', () => {
  it('shows the three Regression topics as links to their parts of the page', async () => {
    renderDiagram('?p=');
    await waitFor(() => expect(node('regression')).not.toBeNull());
    press('regression');
    await waitFor(() => expect(node('regression/1')).not.toBeNull());
    expect(node('regression/1')?.tagName).toBe('A');
    expect(node('regression/1')).toHaveAttribute('href', '/regression?s=1');
    expect(node('regression/3')).toHaveAttribute('href', '/regression?s=3');
    expect(document.querySelectorAll('[data-col="2"] [data-node-id]')).toHaveLength(3);
    expect(search()).toBe('?p=regression');
  });

  it('opens K-NN to its four distances, each a link, and the other topics are links too', async () => {
    renderDiagram('?p=');
    await waitFor(() => expect(node('classification')).not.toBeNull());
    press('classification');
    await waitFor(() => expect(node('classification/1')).not.toBeNull());
    expect(node('classification/1')?.tagName).toBe('BUTTON');
    expect(node('classification/2')).toHaveAttribute('href', '/classification?s=2');
    expect(node('classification/4')).toHaveAttribute('href', '/classification?s=4');

    press('classification/1');
    await waitFor(() => expect(node('classification/1.2')).not.toBeNull());
    expect(node('classification/1')).toHaveAttribute('aria-expanded', 'true');
    expect(node('classification/1.1')).toHaveAttribute('href', '/classification?s=1.1');
    expect(node('classification/1.4')).toHaveAttribute('href', '/classification?s=1.4');
    expect(document.querySelectorAll('[data-col="3"] [data-node-id]')).toHaveLength(4);
    expect(search()).toBe('?p=classification:1');

    // another section replaces the K-NN column
    press('classification');
    await waitFor(() => expect(node('classification/1')).toBeNull());
  });

  it('never shows explanation, formulas or examples in the diagram', async () => {
    renderDiagram('?p=classification:1');
    await waitFor(() => expect(node('classification/1.2')).not.toBeNull());
    expect(document.querySelectorAll('article')).toHaveLength(0);
    expect(document.querySelector('.katex')).toBeNull();
    expect(screen.queryByRole('button', { name: /ตัวอย่าง/ })).toBeNull();
    expect(screen.queryByText(UI_TEXT.overview)).toBeNull();
  });

  it('restores the open path from the address, and ignores an old example flag', async () => {
    renderDiagram('?p=classification:1,1.2&x=1');
    await waitFor(() => expect(node('classification/1.2')).not.toBeNull());
    expect(node('classification/1')).toHaveAttribute('aria-expanded', 'true');
    expect(document.querySelectorAll('div[data-col]')).toHaveLength(4);
    expect(document.querySelectorAll('article')).toHaveLength(0);
  });
});

describe('keyboard and announcements', () => {
  it('closes the deepest open node on Esc and puts focus back on its control', async () => {
    renderDiagram('?p=classification:1');
    await waitFor(() => expect(node('classification/1.1')).not.toBeNull());
    const region = screen.getByRole('region', { name: UI_TEXT.diagramTitle });

    fireEvent.keyDown(region, { key: 'Escape' });
    await waitFor(() => expect(node('classification/1.1')).toBeNull());
    expect(node('classification/1')).toHaveFocus();
    expect(search()).toBe('?p=classification');

    fireEvent.keyDown(region, { key: 'Escape' });
    expect(node('classification')).toHaveFocus();
    fireEvent.keyDown(region, { key: 'Escape' });
    expect(node('root')).toHaveFocus();
    expect(search()).toBe('');
  });

  it('moves between nodes with the arrow keys, links included', async () => {
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
    expect(node('clustering/1')).toHaveAttribute('href', '/clustering?s=1');
  });
});
