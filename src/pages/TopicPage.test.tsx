import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UI_TEXT } from '@/config/site';
import * as loaders from '@/content/loaders';
import { jumpTo } from '@/lib/jumpTo';
import { counts, fileOf, metaMap } from '@/test/content';
import TopicPage from './TopicPage';

vi.mock('@/content/loaders', async () => {
  const { fileOf: file, metaMap: meta } = await import('@/test/content');
  return {
    loadPage: vi.fn((id: Parameters<typeof file>[0]) => Promise.resolve(file(id))),
    loadMeta: vi.fn(() => Promise.resolve(meta)),
    loadHome: vi.fn(),
  };
});
vi.mock('@/lib/jumpTo', () => ({ jumpTo: vi.fn(() => true) }));

function renderPage(path: string, id: Parameters<typeof fileOf>[0]) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <TopicPage pageId={id} />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('TopicPage', () => {
  it('shows the hero from the meta file: tag, title, lead and the counts of the data', async () => {
    renderPage('/classification', 'classification');
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Classification' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Supervised · 02 / 03')).toBeInTheDocument();
    expect(screen.getByText(/การจำแนกประเภท/)).toBeInTheDocument();
    const stats = metaMap.classification.stats;
    expect(screen.getByText('หัวข้อ').previousElementSibling).toHaveTextContent(
      String(stats.sections + stats.subtopics),
    );
    expect(screen.getByText('ตัวอย่างโจทย์').previousElementSibling).toHaveTextContent(
      String(counts.classification.examples),
    );
    await waitFor(() => expect(document.title).toBe('Classification | ML Notes'));
  });

  it('loads and renders the content after the hero', async () => {
    const { container } = renderPage('/regression', 'regression');
    await waitFor(() =>
      expect(container.querySelectorAll('article')).toHaveLength(counts.regression.examples),
    );
    expect(container.querySelectorAll('table')).toHaveLength(counts.regression.tables);
    expect(screen.getByText('ภาพรวม')).toBeInTheDocument();
    expect(jumpTo).not.toHaveBeenCalled();
  });

  it('jumps once to the part named by ?s=, mounting everything first', async () => {
    const { container } = renderPage('/classification?s=1.3/ex2', 'classification');
    await waitFor(() => expect(jumpTo).toHaveBeenCalledWith('classification/1.3/ex2'), {
      timeout: 10000,
    });
    expect(jumpTo).toHaveBeenCalledTimes(1);
    expect(container.querySelector('[id="classification/1.3/ex2"]')).not.toBeNull();
  });

  it('understands ?s=overview', async () => {
    renderPage('/regression?s=overview', 'regression');
    await waitFor(() => expect(jumpTo).toHaveBeenCalledWith('regression/overview'), {
      timeout: 10000,
    });
  });

  it('shows an error with a retry when the content cannot be loaded, and loads it on retry', async () => {
    vi.mocked(loaders.loadPage).mockRejectedValueOnce(new Error('offline'));
    const { container } = renderPage('/clustering', 'clustering');
    const retry = await screen.findByRole('button', { name: UI_TEXT.retry });
    expect(screen.getByRole('alert')).toHaveTextContent(UI_TEXT.loadError);
    retry.click();
    await waitFor(() =>
      expect(container.querySelectorAll('article')).toHaveLength(counts.clustering.examples),
    );
  });

  it('mounts every part of the page before a jump from the contents, so the target exists', async () => {
    class FakeObserver {
      observe() {}
      disconnect() {}
      unobserve() {}
      takeRecords = () => [];
    }
    vi.stubGlobal('IntersectionObserver', FakeObserver);
    try {
      const { container } = renderPage('/classification', 'classification');
      await screen.findByRole('button', { name: UI_TEXT.railOpen }, { timeout: 10000 });
      // only the first parts are mounted, the rest are placeholders
      expect(container.querySelectorAll('article').length).toBeLessThan(
        counts.classification.examples,
      );
      expect(container.querySelectorAll('div[aria-hidden="true"][id]').length).toBeGreaterThan(0);

      fireEvent.click(screen.getByRole('button', { name: UI_TEXT.railOpen }));
      fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: /ID3/ }));
      await waitFor(() => expect(jumpTo).toHaveBeenCalledWith('classification/4'));
      expect(container.querySelectorAll('article')).toHaveLength(counts.classification.examples);
      expect(container.querySelector('[id="classification/4"]')).not.toBeNull();
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
