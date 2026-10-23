// @vitest-environment node
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { PAGES } from '../src/config/site.ts';

const root = process.cwd();
const design = readFileSync(join(root, 'DESIGN-cohere.md'), 'utf8');
const css = readFileSync(join(root, 'src/styles/index.css'), 'utf8');

/** Reads the `key: value` pairs of one top-level block of the DESIGN front matter. */
function frontMatterBlock(name: string): Record<string, string> {
  const front = design.split(/^---$/m)[1];
  const lines = front.split('\n');
  const start = lines.findIndex((l) => l === `${name}:`);
  const out: Record<string, string> = {};
  for (const line of lines.slice(start + 1)) {
    if (!line.startsWith('  ')) break;
    const m = /^ {2}([\w-]+): "?([^"]+?)"?$/.exec(line);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

/** Reads the custom properties declared in the @theme block of index.css. */
function themeVars(): Record<string, string> {
  const theme = /@theme\s*\{([\s\S]*?)\n\}/.exec(css)?.[1] ?? '';
  const out: Record<string, string> = {};
  for (const m of theme.matchAll(/(--[\w-]+):\s*([^;]+);/g)) out[m[1]] = m[2].trim();
  return out;
}

function luminance(hex: string): number {
  const channel = (i: number) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe('design tokens follow DESIGN-cohere.md', () => {
  const vars = themeVars();

  it('has every color of the design file with the same value', () => {
    const colors = frontMatterBlock('colors');
    expect(Object.keys(colors).length).toBeGreaterThanOrEqual(20);
    for (const [name, value] of Object.entries(colors)) {
      expect(vars[`--color-${name}`], name).toBe(value);
    }
  });

  it('has every radius of the design file with the same value', () => {
    const rounded = frontMatterBlock('rounded');
    for (const [name, value] of Object.entries(rounded)) {
      expect(vars[`--radius-${name}`], name).toBe(value);
    }
  });

  it('has the section spacing of the design file', () => {
    expect(vars['--spacing-section']).toBe(frontMatterBlock('spacing').section);
  });

  it('uses a Latin face first and IBM Plex Sans Thai for Thai in every stack', () => {
    expect(vars['--font-display']).toMatch(/^'Space Grotesk', 'IBM Plex Sans Thai'/);
    expect(vars['--font-heading']).toMatch(/^'Inter', 'IBM Plex Sans Thai'/);
    expect(vars['--font-sans']).toMatch(/^'Inter', 'IBM Plex Sans Thai'/);
    expect(vars['--font-mono']).toMatch(/^'IBM Plex Mono', 'IBM Plex Sans Thai'/);
  });

  it('switches the default Tailwind palette and radii off, so only design tokens exist', () => {
    expect(css).toContain('--color-*: initial;');
    expect(css).toContain('--radius-*: initial;');
  });

  it('gives every topic page a band colour that exists in the design', () => {
    for (const page of PAGES) {
      expect(vars[`--color-${page.band}`], page.id).toBeDefined();
    }
  });
});

describe('type scale (UI-SPEC.md Addendum B)', () => {
  const utility = (name: string) =>
    new RegExp(`@utility ${name} \\{([\\s\\S]*?)\\n\\}`).exec(css)?.[1] ?? '';
  const sizes = (name: string) =>
    [...utility(name).matchAll(/font-size:\s*(\d+)px/g)].map((m) => Number(m[1]));

  it('steps the display sizes down with the screen width', () => {
    expect(sizes('type-hero')).toEqual([48, 60, 80, 96]);
    expect(sizes('type-product')).toEqual([40, 48, 60, 72]);
    expect(sizes('type-section-display')).toEqual([40, 48, 56, 60]);
    expect(sizes('type-section-heading')).toEqual([28, 32, 40, 48]);
    expect(sizes('type-card-heading')).toEqual([24, 26, 30, 32]);
  });

  it('keeps tight line height and negative tracking only on the Latin-only display tokens', () => {
    for (const name of ['type-hero', 'type-product', 'type-section-display']) {
      expect(utility(name)).toMatch(/line-height:\s*1;/);
      expect(utility(name)).toMatch(/letter-spacing:\s*-/);
    }
    for (const name of ['type-section-heading', 'type-card-heading', 'type-feature-heading']) {
      expect(utility(name)).toMatch(/line-height:\s*1\.[23]\d*;/);
      expect(utility(name)).not.toMatch(/letter-spacing/);
    }
    expect(utility('type-body')).toMatch(/line-height:\s*1\.65;/);
  });

  it('applies uppercase only in the mono label', () => {
    expect(utility('type-mono')).toMatch(/text-transform:\s*uppercase/);
    for (const name of ['type-body', 'type-caption', 'type-button', 'type-card-heading']) {
      expect(utility(name)).not.toMatch(/uppercase/);
    }
  });
});

describe('contrast pairings of UI-SPEC.md section 12', () => {
  const c = frontMatterBlock('colors');
  const aa = 4.5;

  it('keeps every text pairing at WCAG AA or better', () => {
    const pairs: [string, string][] = [
      ['ink', 'canvas'],
      ['primary', 'canvas'],
      ['ink', 'soft-stone'],
      ['ink', 'pale-green'],
      ['ink', 'pale-blue'],
      ['body-muted', 'canvas'],
      ['body-muted', 'soft-stone'],
      ['action-blue', 'canvas'],
      ['on-dark', 'deep-green'],
      ['on-dark', 'dark-navy'],
      ['on-dark', 'primary'],
      ['coral', 'primary'],
      ['coral', 'dark-navy'],
      ['coral', 'deep-green'],
      ['muted', 'primary'],
      ['error', 'canvas'],
    ];
    for (const [fg, bg] of pairs) {
      expect(contrast(c[fg], c[bg]), `${fg} on ${bg}`).toBeGreaterThanOrEqual(aa);
    }
  });

  it('keeps the Ans bar and the focus ring visible (non-text needs 3:1)', () => {
    expect(contrast(c['deep-green'], c['pale-green'])).toBeGreaterThanOrEqual(3);
    expect(contrast(c['focus-blue'], c.canvas)).toBeGreaterThanOrEqual(3);
  });

  it('documents the pairings that must never carry text on a light surface', () => {
    // coral and muted on white fail AA, which is why the rules in UI-SPEC.md section 1 exist
    expect(contrast(c.coral, c.canvas)).toBeLessThan(3);
    expect(contrast(c.muted, c.canvas)).toBeLessThan(aa);
    expect(contrast(c.hairline, c.canvas)).toBeLessThan(2);
  });
});
