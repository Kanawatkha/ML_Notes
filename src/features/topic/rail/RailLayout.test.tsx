import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { UI_TEXT } from '@/config/site';
import { jumpTo } from '@/lib/jumpTo';
import { fileOf } from '@/test/content';
import { TopicOutline } from '../TopicOutline';
import { RailLayout } from './RailLayout';

vi.mock('@/lib/jumpTo', () => ({ jumpTo: vi.fn(() => true) }));

const file = fileOf('classification');

function mockViewport(wide: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: wide && query.includes('1024px'),
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia;
}

function renderLayout(beforeJump?: () => void) {
  return render(
    <RailLayout file={file} beforeJump={beforeJump}>
      <TopicOutline file={file} mountAll />
    </RailLayout>,
  );
}

beforeEach(() => {
  vi.mocked(jumpTo).mockClear();
});

afterEach(() => {
  document.documentElement.removeAttribute('style');
  vi.useRealTimers();
});

describe('contents on a wide screen', () => {
  beforeEach(() => mockViewport(true));

  it('shows the rail as a navigation landmark with every section, and an icon toggle', () => {
    renderLayout();
    const nav = screen.getByRole('navigation', { name: UI_TEXT.railLabel });
    expect(within(nav).getByRole('button', { name: /ID3/ })).toBeInTheDocument();
    const toggle = screen.getByRole('button', { name: UI_TEXT.railClose });
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(toggle).toHaveAttribute('aria-controls', nav.id);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('folds and unfolds with the toggle, keeping the rail out of the tab order while folded', () => {
    renderLayout();
    const nav = screen.getByRole('navigation', { name: UI_TEXT.railLabel });
    fireEvent.click(screen.getByRole('button', { name: UI_TEXT.railClose }));
    expect(screen.getByRole('button', { name: UI_TEXT.railOpen })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(nav.closest('[inert]')).not.toBeNull();
    expect(nav.closest('[aria-hidden="true"]')).not.toBeNull();

    fireEvent.click(screen.getByRole('button', { name: UI_TEXT.railOpen }));
    expect(nav.closest('[inert]')).toBeNull();
  });

  it('gives the room of the rail to the page body when it folds, with a transition on the columns', () => {
    const { container } = renderLayout();
    const grid = container.querySelector('.grid') as HTMLElement;
    expect(grid.className).toContain('grid-cols-[264px_minmax(0,1fr)]');
    expect(grid.className).toContain('transition-[grid-template-columns]');
    expect(grid.className).toContain('motion-reduce:transition-none');
    fireEvent.click(screen.getByRole('button', { name: UI_TEXT.railClose }));
    expect(grid.className).toContain('grid-cols-[0px_minmax(0,1fr)]');
  });

  it('puts the toggle in the page margin, outside the grid, and keeps it when the rail folds', () => {
    const { container } = renderLayout();
    const grid = container.querySelector('.grid') as HTMLElement;
    const toggle = screen.getByRole('button', { name: UI_TEXT.railClose });
    expect(grid.contains(toggle)).toBe(false);
    expect(toggle.closest('.absolute')?.className).toContain('left-[calc(var(--rail-pad)-60px)]');
    fireEvent.click(toggle);
    expect(screen.getByRole('button', { name: UI_TEXT.railOpen })).toBeInTheDocument();
  });

  it('runs beforeJump, then jumps to the id of the pressed entry', () => {
    const order: string[] = [];
    vi.mocked(jumpTo).mockImplementation((id) => {
      order.push(`jump ${id}`);
      return true;
    });
    renderLayout(() => order.push('before'));
    fireEvent.click(screen.getByRole('button', { name: /ID3/ }));
    expect(order).toEqual(['before', 'jump classification/4']);
  });
});

describe('contents on a narrow screen', () => {
  beforeEach(() => mockViewport(false));

  it('has no rail, a floating icon button, and no dialog until it is pressed', () => {
    renderLayout();
    expect(screen.queryByRole('navigation', { name: UI_TEXT.railLabel })).toBeNull();
    expect(screen.queryByRole('dialog')).toBeNull();
    const fab = screen.getByRole('button', { name: UI_TEXT.railOpen });
    expect(fab).toHaveAttribute('aria-expanded', 'false');
    expect(fab.className).toContain('fixed');
  });

  it('opens a modal drawer with focus inside, locks the page, and closes with Esc returning focus', () => {
    vi.useFakeTimers();
    renderLayout();
    const fab = screen.getByRole('button', { name: UI_TEXT.railOpen });
    fireEvent.click(fab);
    const dialog = screen.getByRole('dialog', { name: UI_TEXT.railLabel });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog.contains(document.activeElement)).toBe(true);
    expect(document.documentElement.style.overflow).toBe('hidden');

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(document.activeElement).toBe(fab);
    expect(document.documentElement.style.overflow).toBe('');
    act(() => vi.advanceTimersByTime(300));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('closes when the scrim is pressed', () => {
    vi.useFakeTimers();
    renderLayout();
    fireEvent.click(screen.getByRole('button', { name: UI_TEXT.railOpen }));
    const scrim = screen.getByRole('dialog').parentElement as HTMLElement;
    fireEvent.pointerDown(scrim);
    act(() => vi.advanceTimersByTime(300));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('closes the drawer on a choice, unlocks the page and jumps after a moment', () => {
    vi.useFakeTimers();
    const before = vi.fn();
    renderLayout(before);
    fireEvent.click(screen.getByRole('button', { name: UI_TEXT.railOpen }));
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: /FFBP/ }));
    expect(document.documentElement.style.overflow).toBe('');
    expect(jumpTo).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(60));
    expect(before).toHaveBeenCalledTimes(1);
    expect(jumpTo).toHaveBeenCalledWith('classification/3');
  });
});
