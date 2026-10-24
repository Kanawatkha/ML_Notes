import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Navbar } from '@/components/layout/Navbar';
import { PAGES, REFERENCE_PAGE, UI_TEXT } from '@/config/site';

function renderAt(path: string) {
  let go: (to: string) => void = () => {};
  function Probe() {
    const navigate = useNavigate();
    go = navigate;
    return null;
  }
  render(
    <MemoryRouter initialEntries={[path]}>
      <Navbar />
      <Probe />
    </MemoryRouter>,
  );
  return { go: (to: string) => act(() => go(to)) };
}

beforeEach(() => {
  // a mouse device without a share sheet: the share button opens the dialog
  window.matchMedia = vi.fn().mockImplementation(() => ({
    matches: false,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia;
});

afterEach(() => {
  document.documentElement.removeAttribute('style');
  vi.useRealTimers();
});

describe('tabs', () => {
  it('lists the topic pages in order and marks the current one', () => {
    renderAt('/classification');
    const nav = screen.getByRole('navigation', { name: 'ML Notes' });
    const labels = [...PAGES.map((p) => p.label), REFERENCE_PAGE.label];
    for (const label of labels) {
      expect(within(nav).getByRole('link', { name: label })).toBeInTheDocument();
    }
    expect(screen.getByRole('link', { name: 'Classification' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('link', { name: 'Regression' })).not.toHaveAttribute('aria-current');
  });

  it('links the logo to Home', () => {
    renderAt('/clustering');
    expect(screen.getByRole('link', { name: `ML Notes: ${UI_TEXT.home}` })).toHaveAttribute(
      'href',
      '/',
    );
  });
});

describe('mobile menu', () => {
  it('opens with one row per page, traps focus and closes with Esc', () => {
    vi.useFakeTimers();
    renderAt('/');
    const toggle = screen.getByRole('button', { name: UI_TEXT.menuOpen });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(toggle);

    const menu = document.getElementById('mobile-menu') as HTMLElement;
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(toggle).toHaveAccessibleName(UI_TEXT.menuClose);
    const rows = within(menu).getAllByRole('link');
    expect(rows.map((r) => r.getAttribute('href'))).toEqual([
      '/',
      ...PAGES.map((p) => p.route),
      REFERENCE_PAGE.route,
    ]);
    expect(menu.contains(document.activeElement)).toBe(true);
    expect(document.documentElement.style.overflow).toBe('hidden');

    // Tab from the last row wraps to the first
    rows[rows.length - 1].focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(rows[0]);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(document.activeElement).toBe(toggle);
    act(() => vi.advanceTimersByTime(300));
    expect(document.getElementById('mobile-menu')).toBeNull();
    expect(document.documentElement.style.overflow).toBe('');
  });

  it('closes when the route changes', () => {
    vi.useFakeTimers();
    const { go } = renderAt('/');
    fireEvent.click(screen.getByRole('button', { name: UI_TEXT.menuOpen }));
    expect(document.getElementById('mobile-menu')).not.toBeNull();
    go('/regression');
    act(() => vi.advanceTimersByTime(300));
    expect(document.getElementById('mobile-menu')).toBeNull();
  });
});

describe('share', () => {
  it('opens the dialog with the current address and a QR code', async () => {
    vi.useFakeTimers();
    renderAt('/');
    const share = screen.getByRole('button', { name: UI_TEXT.share });
    expect(share).toHaveAttribute('aria-haspopup', 'dialog');
    // the share handler is async (it asks the share sheet first), so flush it
    await act(async () => {
      fireEvent.click(share);
      await Promise.resolve();
    });
    const dialog = screen.getByRole('dialog', { name: UI_TEXT.shareTitle });
    expect(within(dialog).getByRole('textbox')).toHaveValue(window.location.href);
    expect(within(dialog).getByRole('img', { name: /^QR / })).toBeInTheDocument();
    expect(dialog.contains(document.activeElement)).toBe(true);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(document.activeElement).toBe(share);
    act(() => vi.advanceTimersByTime(300));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('on a phone with a share sheet opens the same dialog, and offers the sheet inside it', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      addEventListener: () => {},
      removeEventListener: () => {},
    })) as unknown as typeof window.matchMedia;
    const share = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'share', { value: share, configurable: true });
    try {
      renderAt('/');
      fireEvent.click(screen.getByRole('button', { name: UI_TEXT.share }));
      const dialog = screen.getByRole('dialog', { name: UI_TEXT.shareTitle });
      expect(share).not.toHaveBeenCalled();
      expect(within(dialog).getByRole('img', { name: /^QR / })).toBeInTheDocument();
      fireEvent.click(within(dialog).getByRole('button', { name: UI_TEXT.shareOther }));
      expect(share).toHaveBeenCalledWith({ title: document.title, url: window.location.href });
    } finally {
      Reflect.deleteProperty(navigator, 'share');
    }
  });

  it('copies the link and says so', async () => {
    const writeText = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    renderAt('/');
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: UI_TEXT.share }));
      await Promise.resolve();
    });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: UI_TEXT.copyLink }));
      await Promise.resolve();
    });
    expect(writeText).toHaveBeenCalledWith(window.location.href);
    expect(screen.getByText(UI_TEXT.linkCopied)).toBeInTheDocument();
  });
});
