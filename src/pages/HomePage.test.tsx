import { render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { PAGES, UI_TEXT } from '@/config/site';
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

  it('shows the diagram section and the three topic cards with a link to each page', async () => {
    renderHome();
    expect(
      screen.getByRole('heading', { level: 2, name: UI_TEXT.diagramTitle }),
    ).toBeInTheDocument();
    const cards = await screen.findByRole('heading', { level: 2, name: UI_TEXT.allContent });
    expect(cards).toBeInTheDocument();
    for (const page of PAGES) {
      const card = screen.getByRole('heading', { level: 3, name: page.label }).closest('article');
      expect(card).not.toBeNull();
      expect(
        within(card as HTMLElement).getByRole('link', { name: UI_TEXT.openPage }),
      ).toHaveAttribute('href', page.route);
    }
  });

  it('lists a row per section in a card, with the sub-topics of K-NN under it', async () => {
    renderHome();
    const card = (await screen.findByRole('heading', { level: 3, name: 'Classification' })).closest(
      'article',
    ) as HTMLElement;
    for (const title of ['K-NN', 'Perceptron', 'FFBP', 'ID3']) {
      expect(within(card).getByText(title)).toBeInTheDocument();
    }
    expect(
      within(card).getByText('Euclidean · Cosine · Squared Euclidean · Manhattan'),
    ).toBeInTheDocument();
    // Regression counts its overview as a row of the diagram but not of the card
    const regression = screen
      .getByRole('heading', { level: 3, name: 'Regression' })
      .closest('article') as HTMLElement;
    expect(within(regression).getAllByRole('listitem')).toHaveLength(3);
  });
});
