import type { Block, Cell, Inline, ListItem } from '../../src/content/types.ts';
import { HtmlError, splitHead, splitTable } from './html.ts';
import { renderMath } from './math.ts';
import { extractSvg } from './svg.ts';

export type Token =
  | { k: 'heading'; level: number; title: Inline[]; line: number }
  | { k: 'block'; block: Block; line: number };

type Line = { text: string; no: number };

export class ParseError extends Error {}

/** The deepest heading level the content may use: `#####` is the Sol heading of an example in a sub-topic. */
export const MAX_HEADING_LEVEL = 5;

const ESCAPABLE = '\\`*_{}[]()#+-.!|$<>~&';
const LIST_RE = /^(-|\d+\.)\s+(.*)$/;
const HEADING_RE = /^(#{1,6})\s+(.*)$/;
const STEP_RE = /^(?:\d+\.\s|iter\s*\d+)/i;

/* ---------- inline ---------- */

function findMathEnd(text: string, from: number): number {
  for (let j = from; j < text.length; j++) {
    if (text[j] === '\\') {
      j++;
      continue;
    }
    if (text[j] === '$') return j;
  }
  return -1;
}

function findStrongEnd(text: string, from: number): number {
  for (let j = from; j < text.length; j++) {
    const c = text[j];
    if (c === '\\') {
      j++;
      continue;
    }
    if (c === '$') {
      const e = findMathEnd(text, j + 1);
      if (e < 0) return -1;
      j = e;
      continue;
    }
    if (c === '*' && text[j + 1] === '*') return j;
  }
  return -1;
}

function decodeEntity(name: string): string | null {
  if (name === 'amp') return '&';
  if (name === 'lt') return '<';
  if (name === 'gt') return '>';
  if (name === 'quot') return '"';
  if (name === 'nbsp') return ' ';
  if (name.startsWith('#')) return String.fromCodePoint(Number(name.slice(1)));
  return null;
}

export function parseInline(text: string, where: string): Inline[] {
  const out: Inline[] = [];
  let buf = '';
  const flush = () => {
    if (buf) {
      out.push({ t: 'text', v: buf });
      buf = '';
    }
  };
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (ch === '\\' && i + 1 < text.length && ESCAPABLE.includes(text[i + 1])) {
      buf += text[i + 1];
      i += 2;
      continue;
    }
    if (ch === '$') {
      if (text[i + 1] === '$') throw new ParseError(`${where}: display math inside a line of text`);
      const j = findMathEnd(text, i + 1);
      if (j < 0) throw new ParseError(`${where}: unmatched "$" in: ${text.slice(i, i + 40)}`);
      const tex = text.slice(i + 1, j);
      if (!tex.trim()) throw new ParseError(`${where}: empty inline math`);
      flush();
      out.push({ t: 'math', tex, html: renderMath(tex, false) });
      i = j + 1;
      continue;
    }
    if (ch === '*' && text[i + 1] === '*') {
      const j = findStrongEnd(text, i + 2);
      if (j < 0) throw new ParseError(`${where}: unmatched "**" in: ${text.slice(i, i + 40)}`);
      flush();
      out.push({ t: 'strong', c: parseInline(text.slice(i + 2, j), where) });
      i = j + 2;
      continue;
    }
    if (ch === '`') {
      const j = text.indexOf('`', i + 1);
      if (j < 0) throw new ParseError(`${where}: unmatched backtick`);
      flush();
      out.push({ t: 'code', v: text.slice(i + 1, j) });
      i = j + 1;
      continue;
    }
    if (ch === '&') {
      const m = /^&(#\d+|[a-z]+);/.exec(text.slice(i, i + 12));
      if (m) {
        const dec = decodeEntity(m[1]);
        if (dec === null) throw new ParseError(`${where}: unsupported entity ${m[0]}`);
        buf += dec;
        i += m[0].length;
        continue;
      }
    }
    if (ch === '<') {
      const tag = /^<(sup|b)>/.exec(text.slice(i, i + 6));
      if (tag) {
        const close = `</${tag[1]}>`;
        const j = text.indexOf(close, i + tag[0].length);
        if (j < 0) throw new ParseError(`${where}: <${tag[1]}> is not closed`);
        flush();
        const inner = parseInline(text.slice(i + tag[0].length, j), where);
        out.push(tag[1] === 'sup' ? { t: 'sup', c: inner } : { t: 'strong', c: inner });
        i = j + close.length;
        continue;
      }
      if (/[a-zA-Z/!]/.test(text[i + 1] ?? '')) {
        throw new ParseError(`${where}: unsupported HTML in text: ${text.slice(i, i + 30)}`);
      }
    }
    buf += ch;
    i++;
  }
  flush();
  return out;
}

/** Text of an inline run, used for flags and to test whether a cell is empty. */
function plain(c: Inline[]): string {
  return c
    .map((i) => {
      if (i.t === 'text' || i.t === 'code') return i.v;
      if (i.t === 'strong' || i.t === 'sup') return plain(i.c);
      return `$${i.tex}$`;
    })
    .join('');
}

/* ---------- blocks ---------- */

function isListStart(text: string): boolean {
  return LIST_RE.test(text);
}

function isBlockStart(text: string): boolean {
  const t = text.trim();
  return (
    t === '' ||
    /^---+$/.test(t) ||
    t.startsWith('<div align=') ||
    t.startsWith('<table') ||
    HEADING_RE.test(text) ||
    t.startsWith('$$') ||
    t.startsWith('>') ||
    t.startsWith('|') ||
    isListStart(text)
  );
}

function dedent(lines: Line[]): Line[] {
  let min = Infinity;
  for (const l of lines) {
    if (l.text.trim() === '') continue;
    min = Math.min(min, l.text.length - l.text.trimStart().length);
  }
  if (!Number.isFinite(min)) min = 0;
  return lines.map((l) => ({ no: l.no, text: l.text.slice(Math.min(min, l.text.length)) }));
}

function toBlocks(tokens: Token[], where: string): Block[] {
  return tokens.map((t) => {
    if (t.k === 'heading') throw new ParseError(`${where}: heading inside a nested block`);
    return t.block;
  });
}

function paragraph(text: string, where: string): Block {
  const c = parseInline(text, where);
  const first = c[0];
  const block: Block = { t: 'p', c };
  if (c.length > 0 && c.every((i) => i.t === 'strong')) block.label = true;
  if (first && first.t === 'strong' && STEP_RE.test(plain(first.c).trim())) block.step = true;
  return block;
}

function parseList(lines: Line[], start: number, file: string): { block: Block; next: number } {
  const first = LIST_RE.exec(lines[start].text);
  if (!first) throw new ParseError(`${file}:${lines[start].no}: not a list item`);
  const ordered = /^\d+\./.test(first[1]);
  const items: ListItem[] = [];
  let i = start;
  while (i < lines.length) {
    const m = LIST_RE.exec(lines[i].text);
    if (!m || /^\d+\./.test(m[1]) !== ordered) break;
    const cont: Line[] = [];
    let j = i + 1;
    while (j < lines.length) {
      const t = lines[j].text;
      if (t.trim() === '') {
        let k = j + 1;
        while (k < lines.length && lines[k].text.trim() === '') k++;
        if (k < lines.length && /^\s+\S/.test(lines[k].text)) {
          cont.push(lines[j]);
          j++;
          continue;
        }
        break;
      }
      if (/^\s+\S/.test(t)) {
        cont.push(lines[j]);
        j++;
        continue;
      }
      break;
    }
    const where = `${file}:${lines[i].no}`;
    items.push({
      c: parseInline(m[2], where),
      children: cont.length > 0 ? toBlocks(parseLines(dedent(cont), file, false), where) : [],
    });
    i = j;
    // a blank line followed by another item of the same kind continues the same list
    let k = i;
    while (k < lines.length && lines[k].text.trim() === '') k++;
    if (k < lines.length && k > i) {
      const n = LIST_RE.exec(lines[k].text);
      if (n && /^\d+\./.test(n[1]) === ordered) i = k;
    }
  }
  return { block: { t: 'list', ordered, items }, next: i };
}

function parseTable(src: string, where: string): Block {
  try {
    const rows = splitTable(src, where).map((row) =>
      row.map((raw): Cell => {
        const c = parseInline(raw.html, where);
        const empty = plain(c).trim() === '';
        return {
          header: raw.header,
          ...(raw.align ? { align: raw.align } : {}),
          c: empty ? [] : c,
        };
      }),
    );
    return { t: 'table', ...splitHead(rows) };
  } catch (e) {
    if (e instanceof HtmlError) throw new ParseError(e.message);
    throw e;
  }
}

export function parseLines(lines: Line[], file: string, allowHeadings: boolean): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < lines.length) {
    const { text, no } = lines[i];
    const t = text.trim();
    const where = `${file}:${no}`;

    if (t === '' || /^---+$/.test(t)) {
      i++;
      continue;
    }

    if (t.startsWith('<div align=')) {
      let j = i;
      const parts: string[] = [];
      while (j < lines.length) {
        parts.push(lines[j].text);
        if (lines[j].text.includes('</div>')) break;
        j++;
      }
      if (j >= lines.length) throw new ParseError(`${where}: unclosed <div>`);
      try {
        const fig = extractSvg(parts.join('\n'), where);
        tokens.push({ k: 'block', block: { t: 'figure', ...fig }, line: no });
      } catch (e) {
        throw new ParseError(e instanceof Error ? e.message : String(e));
      }
      i = j + 1;
      continue;
    }

    if (t.startsWith('<table')) {
      let j = i;
      const parts: string[] = [];
      while (j < lines.length) {
        parts.push(lines[j].text);
        if (lines[j].text.includes('</table>')) break;
        j++;
      }
      if (j >= lines.length) throw new ParseError(`${where}: unclosed <table>`);
      tokens.push({ k: 'block', block: parseTable(parts.join('\n'), where), line: no });
      i = j + 1;
      continue;
    }

    const h = HEADING_RE.exec(text);
    if (h) {
      if (!allowHeadings) throw new ParseError(`${where}: heading inside a nested block`);
      if (h[1].length > MAX_HEADING_LEVEL)
        throw new ParseError(`${where}: heading level ${h[1].length} is not supported`);
      tokens.push({
        k: 'heading',
        level: h[1].length,
        title: parseInline(h[2].trim(), where),
        line: no,
      });
      i++;
      continue;
    }

    if (t.startsWith('$$')) {
      let tex: string;
      if (t.length >= 4 && t.endsWith('$$')) {
        tex = t.slice(2, -2);
        i++;
      } else {
        const parts = [t.slice(2)];
        let j = i + 1;
        let closed = false;
        while (j < lines.length) {
          const u = lines[j].text;
          if (u.trim().endsWith('$$')) {
            parts.push(u.trim().slice(0, -2));
            closed = true;
            break;
          }
          parts.push(u);
          j++;
        }
        if (!closed) throw new ParseError(`${where}: unclosed $$ block`);
        tex = parts.join('\n');
        i = j + 1;
      }
      tex = tex.trim();
      if (!tex) throw new ParseError(`${where}: empty display math`);
      tokens.push({ k: 'block', block: { t: 'math', tex, html: renderMath(tex, true) }, line: no });
      continue;
    }

    if (t.startsWith('>')) {
      const inner: Line[] = [];
      let j = i;
      while (j < lines.length && lines[j].text.trim().startsWith('>')) {
        inner.push({ no: lines[j].no, text: lines[j].text.trim().replace(/^>\s?/, '') });
        j++;
      }
      tokens.push({
        k: 'block',
        block: { t: 'note', c: toBlocks(parseLines(inner, file, false), where) },
        line: no,
      });
      i = j;
      continue;
    }

    if (t.startsWith('|')) {
      throw new ParseError(`${where}: Markdown pipe tables are not supported, use an HTML table`);
    }

    if (isListStart(text)) {
      const { block, next } = parseList(lines, i, file);
      tokens.push({ k: 'block', block, line: no });
      i = next;
      continue;
    }

    // paragraph
    const parts: string[] = [text.trim()];
    let j = i + 1;
    while (j < lines.length && !isBlockStart(lines[j].text)) {
      parts.push(lines[j].text.trim());
      j++;
    }
    tokens.push({ k: 'block', block: paragraph(parts.join('\n'), where), line: no });
    i = j;
  }
  return tokens;
}

export function parseDocument(md: string, file: string): Token[] {
  const lines = md.split(/\r?\n/).map((text, idx) => ({ text, no: idx + 1 }));
  return parseLines(lines, file, true);
}
