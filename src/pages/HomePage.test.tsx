import { render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { UI_TEXT } from '@/config/site';
import { homeFile } from '@/test/content';
import HomePage from './HomePage';

vi.mock('@/content/loaders', async () => {
  const { fileOf: file, homeFile: home } = await import('@/test/content');
  return {
    loadHome: vi.fn(() => Promise.resolve(home)),
    loadPage: vi.fn((id: Parameters<typeof file>[0]) => Promise.resolve(file(id))),
    loadMeta: vi.fn(),
  };
});

function renderHome() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <HomePage />
    </MemoryRouter>,
  );
}

describe('HomePage', () => {
  it('has the site name as its one h1, the lead and the course label, and sets the page title', async () => {
    renderHome();
    expect(screen.getByRole('heading', { level: 1, name: 'ML Notes' })).toBeInTheDocument();
    expect(screen.getByText(UI_TEXT.homeLead)).toBeInTheDocument();
    expect(screen.getByText(UI_TEXT.courseLabel)).toBeInTheDocument();
    await waitFor(() => expect(document.title).toBe('ML Notes'));
    await screen.findByText(UI_TEXT.statExamples);
  });

  it('counts the topics, leaves and examples from the home file', async () => {
    renderHome();
    const label = await screen.findByText(UI_TEXT.statExamples);
    const stats = label.closest('dl') as HTMLElement;
    expect(within(stats).getByText(UI_TEXT.statTopics).previousElementSibling).toHaveTextContent(
      String(homeFile.stats.topics),
    );
    expect(within(stats).getByText(UI_TEXT.statLeaves).previousElementSibling).toHaveTextContent(
      String(homeFile.stats.leaves),
    );
    expect(label.previousElementSibling).toHaveTextContent(String(homeFile.stats.examples));
    expect(homeFile.stats).toEqual({ topics: 3, leaves: 11, examples: 18 });
  });

  it('has the hero and the diagram only, with no topic cards below it', async () => {
    renderHome();
    expect(
      screen.getByRole('heading', { level: 2, name: UI_TEXT.diagramTitle }),
    ).toBeInTheDocument();
    await screen.findByText(UI_TEXT.statExamples);
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(1);
    expect(document.querySelector('article')).toBeNull();
    expect(screen.getByRole('region', { name: UI_TEXT.diagramTitle })).toBeInTheDocument();
  });

  it('does not frame the diagram: no filled panel around its scrolling region', () => {
    renderHome();
    const region = screen.getByRole('region', { name: UI_TEXT.diagramTitle });
    expect(region.parentElement?.className ?? '').not.toMatch(/bg-soft-stone|rounded/);
  });
});
