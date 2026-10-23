import type { Inline } from '@/content/types';

/** Plain text of inline nodes (formulas are skipped). Used for page titles and short labels. */
export function plainText(nodes: Inline[]): string {
  return nodes
    .map((n) => {
      if (n.t === 'text' || n.t === 'code') return n.v;
      if (n.t === 'strong' || n.t === 'sup') return plainText(n.c);
      return '';
    })
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * A readable name for a formula that is the only content of a table header cell. The KaTeX output
 * has the formula as hidden MathML, but a header cell needs a name that checkers and every screen
 * reader can see, so it gets this rough reading of the TeX: text commands unwrapped, `_` as "sub",
 * `^` as "sup", `\times` as "times".
 */
export function texLabel(tex: string): string {
  return tex
    .replace(/\\(?:text|textbf|mathbf|mathrm|mathit)\{([^{}]*)\}/g, '$1')
    .replace(/\\(?:times|cdot)/g, ' times ')
    .replace(/\\[,;:! ]/g, ' ')
    .replace(/\\([A-Za-z]+)/g, '$1')
    .replace(/_/g, ' sub ')
    .replace(/\^/g, ' sup ')
    .replace(/[{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** "1" gives "01"; used for the mono section numbers. Sub-topic numbers like "1.2" stay as they are. */
export function padNumber(number: string): string {
  return /^\d+$/.test(number) ? number.padStart(2, '0') : number;
}
