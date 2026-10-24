import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as loaders from '@/content/loaders';
import { fileOf } from '@/test/content';
import DefinitionsPage from './DefinitionsPage';

vi.mock('@/content/loaders', async () => {
  const { fileOf: file, metaMap: meta } = await import('@/test/content');
  return {
    loadPage: vi.fn((id: Parameters<typeof file>[0]) => Promise.resolve(file(id))),
    loadMeta: vi.fn(() => Promise.resolve(meta)),
    loadHome: vi.fn(),
  };
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe('DefinitionsPage', () => {
  it('shows a light hero with the title and lead of the Markdown, and sets the page title', async () => {
    render(
      <MemoryRouter initialEntries={['/definitions']}>
        <DefinitionsPage />
      </MemoryRouter>,
    );
    const title = await screen.findByRole('heading', { level: 1, name: 'Definitions' });
    const hero = title.closest('section') as HTMLElement;
    expect(hero.className).toContain('bg-soft-stone');
    expect(hero).not.toHaveAttribute('data-surface');
    expect(hero).toHaveTextContent('นิยาม');
    await waitFor(() => expect(document.title).toBe('นิยาม | ML Notes'));
  });

  it('loads the definitions file and renders every section and sub-topic', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/definitions']}>
        <DefinitionsPage />
      </MemoryRouter>,
    );
    const file = fileOf('definitions');
    await waitFor(() => expect(loaders.loadPage).toHaveBeenCalledWith('definitions'));
    const expected = file.stats.sections + file.stats.subtopics;
    await waitFor(() =>
      expect(container.querySelectorAll('section[id]').length).toBeGreaterThanOrEqual(expected),
    );
    expect(container.querySelectorAll('table').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('article').length).toBe(0);
  });
});
