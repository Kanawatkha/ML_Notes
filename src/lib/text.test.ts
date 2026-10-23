import { describe, expect, it } from 'vitest';
import type { Inline } from '@/content/types';
import { estimateBlock, estimateBlocks } from './estimate';
import { padNumber, plainText, texLabel } from './text';

describe('plainText', () => {
  it('joins text, bold and superscript runs and skips formulas', () => {
    const nodes: Inline[] = [
      { t: 'text', v: 'Sol' },
      { t: 'sup', c: [{ t: 'text', v: 'n' }] },
      { t: 'text', v: '  and ' },
      { t: 'strong', c: [{ t: 'text', v: 'bold' }] },
      { t: 'math', tex: 'x', html: '' },
    ];
    expect(plainText(nodes)).toBe('Soln and bold');
  });
});

describe('texLabel', () => {
  it('reads subscripts, superscripts, text commands and times', () => {
    expect(texLabel('D_{41}')).toBe('D sub 41');
    expect(texLabel('x^2')).toBe('x sup 2');
    expect(texLabel('\\text{Label}')).toBe('Label');
    expect(texLabel('2\\times2')).toBe('2 times 2');
  });
});

describe('padNumber', () => {
  it('pads section numbers and leaves sub-topic numbers alone', () => {
    expect(padNumber('1')).toBe('01');
    expect(padNumber('12')).toBe('12');
    expect(padNumber('1.2')).toBe('1.2');
  });
});

describe('estimateBlock', () => {
  it('grows with the content of a table and a list', () => {
    const cell = { header: false, c: [] };
    const small = { t: 'table' as const, head: [], rows: [[cell]] };
    const big = { t: 'table' as const, head: [[cell]], rows: [[cell], [cell], [cell]] };
    expect(estimateBlock(big)).toBeGreaterThan(estimateBlock(small));
    const p = { t: 'p' as const, c: [] };
    expect(estimateBlocks([p, p])).toBeGreaterThan(estimateBlocks([p]));
  });
});
