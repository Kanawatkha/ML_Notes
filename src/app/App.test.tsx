import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AppRoutes } from '@/app/App';
import { UI_TEXT } from '@/config/site';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

describe('routes', () => {
  it('renders Home at /', async () => {
    renderAt('/');
    expect(
      await screen.findByRole('heading', { level: 1, name: 'ML Notes' }, { timeout: 10000 }),
    ).toBeInTheDocument();
    await waitFor(() => expect(document.title).toBe('ML Notes'));
  });

  it.each([
    ['/regression', 'Regression'],
    ['/classification', 'Classification'],
    ['/clustering', 'Clustering'],
    ['/definitions', 'Definitions'],
  ])('renders the %s page', async (path, label) => {
    renderAt(path);
    // the first load of a page chunk transforms megabytes of generated JSON: allow for a cold cache
    expect(
      await screen.findByRole('heading', { level: 1, name: label }, { timeout: 15000 }),
    ).toBeInTheDocument();
    await waitFor(
      () => expect(document.title).toBe(`${path === '/definitions' ? 'นิยาม' : label} | ML Notes`),
      { timeout: 15000 },
    );
  });

  it('shows the not-found page with a link back Home for unknown routes', async () => {
    renderAt('/nowhere');
    expect(await screen.findByRole('heading', { name: UI_TEXT.notFound })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: UI_TEXT.backHome })).toHaveAttribute('href', '/');
  });

  it('lists the three topic pages in the navbar', async () => {
    renderAt('/');
    await screen.findByRole('heading', { level: 1 });
    for (const label of ['Regression', 'Classification', 'Clustering']) {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument();
    }
  });
});
