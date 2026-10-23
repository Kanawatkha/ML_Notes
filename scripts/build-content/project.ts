import type { Block, ContentNode, Inline, PageFile } from '../../src/content/types.ts';

/**
 * Round-trip oracle (CONTENT-SCHEMA.md section 10). Both the Markdown and the generated data are
 * projected to the same canonical string: all text with whitespace removed, formulas as
 * placeholders (collected in order), figures as placeholders, heading numbers collected apart.
 * Equality proves nothing was lost, reordered or reworded.
 */
export type Projection = { text: string; math: string[]; figures: number; numbers: string[] };

const squash = (s: string) => s.replace(/\s+/g, '');
const NUMBERED_HEADING = /^#{2,3}\s+(\d+(?:\.\d+)*)\.?\s+/;

/* ---------- Markdown side (independent of the parser) ---------- */

export function projectMarkdown(md: string): Projection {
  const math: string[] = [];
  const numbers: string[] = [];
  let figures = 0;
  let s = md.replace(/\r\n/g, '\n');
  s = s.replace(/<div align="center">[\s\S]*?<\/div>/g, () => {
    figures++;
    return '\n«F»\n';
  });
  s = s
    .split('\n')
    .map((line) => {
      const m = NUMBERED_HEADING.exec(line);
      if (!m) return line;
      numbers.push(m[1]);
      return line.replace(NUMBERED_HEADING, '## ');
    })
    .join('\n');
  s = s.replace(/^\s*---+\s*$/gm, '');
  s = s.replace(
    /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g,
    (_m, d: string | undefined, i: string | undefined) => {
      math.push(squash((d ?? i ?? '').trim()));
      return '«M»';
    },
  );
  s = s.replace(/&nbsp;/g, '');
  s = s.replace(/<\/?(?:table|tr|th|td|sup|b)(?:\s[^>]*)?>/g, ' ');
  s = s.replace(/^\s*>\s?/gm, '');
  s = s.replace(/^\s*(?:-|\d+\.)\s+/gm, '');
  s = s.replace(/^#{1,6}\s+/gm, '');
  s = s.replace(/\*\*/g, '').replace(/`/g, '');
  s = s.replace(/&#(\d+);/g, (_m, n: string) => String.fromCodePoint(Number(n)));
  s = s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  s = s.replace(/\\([\\`*_{}[\]()#+\-.!|$<>~&])/g, '$1');
  return { text: squash(s), math, figures, numbers };
}

/* ---------- data side ---------- */

function inl(c: Inline[], p: Projection): string {
  return c
    .map((i) => {
      if (i.t === 'text' || i.t === 'code') return i.v;
      if (i.t === 'strong' || i.t === 'sup') return inl(i.c, p);
      p.math.push(squash(i.tex));
      return '«M»';
    })
    .join('');
}

function blk(blocks: Block[], p: Projection): string {
  return blocks
    .map((b): string => {
      switch (b.t) {
        case 'p':
          return inl(b.c, p);
        case 'math':
          p.math.push(squash(b.tex));
          return '«M»';
        case 'list':
          return b.items.map((it) => `${inl(it.c, p)} ${blk(it.children, p)}`).join(' ');
        case 'table':
          return [...b.head, ...b.rows]
            .map((row) => row.map((cell) => inl(cell.c, p)).join(' '))
            .join(' ');
        case 'figure':
          p.figures++;
          return '«F»';
        case 'note':
          return blk(b.c, p);
        case 'example':
          return [
            inl(b.title, p),
            blk(b.problem, p),
            inl(b.solLabel, p),
            blk(b.sol, p),
            blk(b.ans, p),
          ].join(' ');
      }
    })
    .join(' ');
}

function node(n: ContentNode, p: Projection): string {
  if (n.number) p.numbers.push(n.number);
  const parts: string[] = [inl(n.title, p), blk(n.lead, p), blk(n.explain, p), blk(n.examples, p)];
  for (const c of n.children) parts.push(node(c, p));
  return parts.join(' ');
}

export function projectData(file: PageFile): Projection {
  const p: Projection = { text: '', math: [], figures: 0, numbers: [] };
  p.text = squash(node(file.root, p));
  return p;
}
