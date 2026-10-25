import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { UI_TEXT } from '@/config/site';
import { fileOf } from '@/test/content';
import { CheatSheet } from './CheatSheet';
import { fitPage, FIT_MAX_PX, FIT_MIN_PX } from './fit';
import { SHEET_SIDE } from './layout';

const file = fileOf('cheatsheet');
const boxes = file.root.children.flatMap((section) => section.children);

afterEach(() => {
  vi.restoreAllMocks();
});

describe('the sheet content', () => {
  it('puts every box of the Markdown on one side, and nothing else', () => {
    expect(Object.keys(SHEET_SIDE).sort()).toEqual(boxes.map((b) => b.id).sort());
  });

  it('has both sides in use', () => {
    const sides = new Set(boxes.map((b) => SHEET_SIDE[b.id]));
    expect(sides).toEqual(new Set([0, 1]));
  });

  it('follows the definitions page: the topics first, then the comparisons', () => {
    expect(file.root.children.map((s) => s.children.length)).toEqual([7, 6]);
  });

  it('has only formulas, definitions and comparisons: no example or exercise', () => {
    expect(file.stats).toMatchObject({ examples: 0, exercises: 0 });
  });
});

describe('fitPage', () => {
  function fakePage(limit: number, extra: Record<string, () => number> = {}) {
    const page = document.createElement('div');
    // the content overflows once the font is bigger than `limit`
    Object.defineProperty(page, 'scrollWidth', {
      get: () => (parseFloat(page.style.fontSize) > limit ? 100 : 10),
    });
    Object.defineProperty(page, 'clientWidth', { get: () => 50 });
    Object.defineProperty(page, 'scrollHeight', { get: () => 10 });
    Object.defineProperty(page, 'clientHeight', { get: () => 50 });
    for (const [key, get] of Object.entries(extra)) Object.defineProperty(page, key, { get });
    return page;
  }

  it('takes the largest size that does not overflow', () => {
    const page = fakePage(9);
    const size = fitPage(page);
    expect(size).toBeGreaterThan(9 - 0.05);
    expect(size).toBeLessThanOrEqual(9);
    expect(page.style.fontSize).toBe(`${size}px`);
  });

  it('never goes outside the minimum and the maximum', () => {
    expect(fitPage(fakePage(0))).toBeLessThan(FIT_MIN_PX + 0.01);
    expect(fitPage(fakePage(1000))).toBeGreaterThan(FIT_MAX_PX - 0.01);
  });

  it('shrinks the type when a formula is wider than its box', () => {
    const page = document.createElement('div');
    const display = document.createElement('div');
    display.className = 'katex-display';
    const formula = document.createElement('span');
    formula.className = 'katex';
    display.appendChild(formula);
    page.appendChild(display);
    Object.defineProperty(display, 'clientWidth', { get: () => 100 });
    Object.defineProperty(formula, 'scrollWidth', {
      get: () => parseFloat(page.style.fontSize) * 20,
    });
    const size = fitPage(page);
    expect(size).toBeLessThanOrEqual(5.03);
    expect(size).toBeGreaterThan(4.9);
  });
});

describe('CheatSheet', () => {
  it('shows both sides first, and one side at a time on request', () => {
    const { container } = render(<CheatSheet file={file} />);
    const wraps = () => [...container.querySelectorAll('.sheet-wrap')];
    expect(wraps()).toHaveLength(2);
    expect(wraps().every((w) => !w.classList.contains('is-off'))).toBe(true);
    expect(screen.getByRole('button', { name: UI_TEXT.sheetBoth })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    fireEvent.click(screen.getByRole('button', { name: UI_TEXT.sheetBack }));
    expect(wraps()[0].classList.contains('is-off')).toBe(true);
    expect(wraps()[0]).toHaveAttribute('aria-hidden', 'true');
    expect(wraps()[1].classList.contains('is-off')).toBe(false);

    fireEvent.click(screen.getByRole('button', { name: UI_TEXT.sheetFront }));
    expect(wraps()[0].classList.contains('is-off')).toBe(false);
    expect(wraps()[1].classList.contains('is-off')).toBe(true);
  });

  it('keeps both sides in the document so that printing gives both', () => {
    const { container } = render(<CheatSheet file={file} />);
    fireEvent.click(screen.getByRole('button', { name: UI_TEXT.sheetFront }));
    expect(container.querySelectorAll('.sheet-page')).toHaveLength(2);
    expect(container.querySelectorAll('.sheet-box')).toHaveLength(boxes.length);
  });

  it('keeps the text of a pressed view button readable (a light label on the dark fill)', () => {
    render(<CheatSheet file={file} />);
    const pressed = screen.getByRole('button', { name: UI_TEXT.sheetBoth });
    expect(pressed.className).toContain('aria-pressed:bg-primary!');
    expect(pressed.className).toContain('aria-pressed:text-on-primary!');
  });

  it('has no explanation text above the sheet', () => {
    const { container } = render(<CheatSheet file={file} />);
    expect(container.textContent).not.toContain('Save as PDF');
  });

  it('exports with the print dialog', () => {
    const print = vi.spyOn(window, 'print').mockImplementation(() => {});
    render(<CheatSheet file={file} />);
    fireEvent.click(screen.getByRole('button', { name: UI_TEXT.sheetExport }));
    expect(print).toHaveBeenCalledTimes(1);
  });

  it('draws the formulas of the Markdown on the sheet, with the pen colours', () => {
    const { container } = render(<CheatSheet file={file} />);
    expect(container.querySelectorAll('.katex').length).toBeGreaterThan(40);
    expect(container.querySelectorAll('.pen-red, .pen-blue').length).toBeGreaterThan(5);
  });
});
