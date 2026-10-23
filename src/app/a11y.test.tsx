import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import axe from 'axe-core';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppRoutes } from '@/app/App';
import { UI_TEXT } from '@/config/site';

/**
 * Structure checks with axe-core. jsdom has no layout, so colour contrast is not measured here:
 * that runs in a real browser (TESTING.md, accessibility).
 */
async function violations() {
  const result = await axe.run(document.body, {
    rules: { 'color-contrast': { enabled: false } },
    resultTypes: ['violations'],
  });
  return result.violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`);
}

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

function mockViewport(wide: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: wide && (query.includes('1024px') || query.includes('768px')),
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia;
}

beforeEach(() => {
  mockViewport(false);
  // axe probes canvas support for its icon checks; jsdom has none and would log for every call
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
});

describe('axe: no serious or critical violations', () => {
  it('Home with the diagram closed', async () => {
    renderAt('/');
    await screen.findByText(UI_TEXT.statExamples, undefined, { timeout: 10000 });
    expect(await violations()).toEqual([]);
  });

  it('Home with the diagram open down to the examples of a leaf', async () => {
    renderAt('/?p=classification:1,1.2&x=1');
    await screen.findByRole('region', { name: /ตัวอย่าง Cosine/ }, { timeout: 10000 });
    expect(await violations()).toEqual([]);
  }, 20000);

  it.each(['/regression', '/classification', '/clustering'])(
    'the page %s on a wide screen',
    async (path) => {
      mockViewport(true);
      renderAt(path);
      await screen.findByRole('navigation', { name: UI_TEXT.railLabel }, { timeout: 15000 });
      await waitFor(
        () => expect(document.querySelectorAll('article[id]').length).toBeGreaterThan(0),
        {
          timeout: 15000,
        },
      );
      expect(await violations()).toEqual([]);
    },
    40000,
  );

  it('a topic page with the contents drawer open', async () => {
    renderAt('/clustering');
    fireEvent.click(
      await screen.findByRole('button', { name: UI_TEXT.railOpen }, { timeout: 15000 }),
    );
    expect(await screen.findByRole('dialog', { name: UI_TEXT.railLabel })).toBeInTheDocument();
    expect(await violations()).toEqual([]);
  }, 40000);

  it('the mobile menu open', async () => {
    renderAt('/');
    fireEvent.click(await screen.findByRole('button', { name: UI_TEXT.menuOpen }));
    const menu = await waitFor(() => {
      const el = document.getElementById('mobile-menu');
      expect(el).not.toBeNull();
      return el as HTMLElement;
    });
    expect(within(menu).getByRole('link', { name: /Clustering/ })).toBeInTheDocument();
    expect(await violations()).toEqual([]);
  });

  it('the share dialog open', async () => {
    renderAt('/');
    fireEvent.click(await screen.findByRole('button', { name: UI_TEXT.share }));
    expect(await screen.findByRole('dialog', { name: UI_TEXT.shareTitle })).toBeInTheDocument();
    expect(await violations()).toEqual([]);
  });

  it('the not-found page', async () => {
    renderAt('/nowhere');
    await screen.findByRole('heading', { name: UI_TEXT.notFound });
    expect(await violations()).toEqual([]);
  });
});
