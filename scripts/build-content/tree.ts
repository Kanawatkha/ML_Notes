import type { Block, ContentNode, Inline, PageFile } from '../../src/content/types.ts';
import { computeStats } from '../../src/content/stats.ts';
import type { Token } from './parse.ts';
import { MAX_HEADING_LEVEL } from './parse.ts';

/* ---------- helpers ---------- */

export function inlineText(c: Inline[]): string {
  return c
    .map((i) => {
      if (i.t === 'text' || i.t === 'code') return i.v;
      if (i.t === 'strong' || i.t === 'sup') return inlineText(i.c);
      return `$${i.tex}$`;
    })
    .join('');
}

/** All visible text of a block. */
export function blockText(b: Block): string {
  switch (b.t) {
    case 'p':
      return inlineText(b.c);
    case 'math':
      return '';
    case 'list':
      return b.items
        .map((it) => `${inlineText(it.c)} ${it.children.map(blockText).join(' ')}`)
        .join(' ');
    case 'table':
      return [...b.head, ...b.rows]
        .map((row) => row.map((c) => inlineText(c.c)).join(' '))
        .join(' ');
    case 'figure':
      return '';
    case 'note':
      return b.c.map(blockText).join(' ');
    case 'example':
      return [...b.problem, ...b.sol, ...b.ans].map(blockText).join(' ');
  }
}

export function walkBlocks(blocks: Block[], fn: (b: Block) => void): void {
  for (const b of blocks) {
    fn(b);
    if (b.t === 'list') for (const it of b.items) walkBlocks(it.children, fn);
    if (b.t === 'note') walkBlocks(b.c, fn);
    if (b.t === 'example') {
      walkBlocks(b.problem, fn);
      walkBlocks(b.sol, fn);
      walkBlocks(b.ans, fn);
    }
  }
}

export function walkNodes(node: ContentNode, fn: (n: ContentNode) => void): void {
  fn(node);
  for (const c of node.children) walkNodes(c, fn);
}

/** True for a paragraph that starts with a bold "Ans". */
export function isAns(b: Block): boolean {
  if (b.t !== 'p') return false;
  const first = b.c[0];
  return first?.t === 'strong' && inlineText(first.c).trim() === 'Ans';
}

/** True when a heading title is exactly `Sol` followed by a superscript `n`. */
export function isSolTitle(title: Inline[]): boolean {
  return (
    title.length === 2 &&
    title[0].t === 'text' &&
    title[0].v === 'Sol' &&
    title[1].t === 'sup' &&
    inlineText(title[1].c) === 'n'
  );
}

/* ---------- raw heading tree ---------- */

export type Raw = {
  level: number;
  title: Inline[];
  line: number;
  blocks: Block[];
  children: Raw[];
};

/**
 * Builds the heading tree. Exactly one level-1 heading; a child is always exactly one level below
 * its parent (a `####` directly under a `##` is an error).
 */
export function buildRaw(tokens: Token[], file: string): Raw {
  const root: Raw = { level: 0, title: [], line: 0, blocks: [], children: [] };
  const stack: Raw[] = [root];
  for (const t of tokens) {
    if (t.k === 'heading') {
      if (t.level > MAX_HEADING_LEVEL)
        throw new Error(`${file}:${t.line}: heading level ${t.level} is not supported`);
      const node: Raw = { level: t.level, title: t.title, line: t.line, blocks: [], children: [] };
      while (stack[stack.length - 1].level >= t.level) stack.pop();
      const parent = stack[stack.length - 1];
      if (t.level !== parent.level + 1) {
        throw new Error(
          `${file}:${t.line}: heading level ${t.level} must sit directly under a level ${t.level - 1} heading`,
        );
      }
      parent.children.push(node);
      stack.push(node);
    } else {
      stack[stack.length - 1].blocks.push(t.block);
    }
  }
  if (root.blocks.length > 0) throw new Error(`${file}: content before the first heading`);
  if (root.children.length !== 1 || root.children[0].level !== 1) {
    throw new Error(`${file}: expected exactly one level-1 heading`);
  }
  return root.children[0];
}

/* ---------- nodes (CONTENT-SCHEMA.md section 5) ---------- */

type Ctx = { page: string; file: string; warn: (m: string) => void; examples: number };

const EXAMPLE_PREFIX = 'ตัวอย่างโจทย์';
const SECTION_RE = /^(\d+)\.\s+/;
const SUBTOPIC_RE = /^(\d+\.\d+)\s+/;

function isExampleHeading(title: Inline[]): boolean {
  return inlineText(title).trim().startsWith(EXAMPLE_PREFIX);
}

/** Splits a leading number off a heading title; the remaining inlines are the title. */
function splitNumber(title: Inline[], re: RegExp): { number: string; title: Inline[] } | undefined {
  const first = title[0];
  if (!first || first.t !== 'text') return undefined;
  const m = re.exec(first.v);
  if (!m) return undefined;
  const rest = first.v.slice(m[0].length);
  return {
    number: m[1],
    title: rest ? [{ t: 'text', v: rest }, ...title.slice(1)] : title.slice(1),
  };
}

function buildExample(raw: Raw, parentId: string, k: number, ctx: Ctx): Block {
  const where = `${ctx.file}:${raw.line}`;
  const sols = raw.children.filter((c) => isSolTitle(c.title));
  if (sols.length !== 1 || raw.children.length !== 1) {
    throw new Error(
      `${where}: an example needs exactly one "Sol" heading below it and nothing else`,
    );
  }
  const sol = sols[0];
  if (sol.level !== raw.level + 1)
    throw new Error(`${ctx.file}:${sol.line}: Sol heading at the wrong level`);
  if (sol.children.length > 0)
    throw new Error(`${ctx.file}:${sol.line}: a Sol heading cannot have headings below it`);
  const at = sol.blocks.findIndex(isAns);
  if (at < 0) ctx.warn(`${where}: example without an "Ans" paragraph`);
  ctx.examples++;
  return {
    t: 'example',
    id: `${parentId}/ex${k}`,
    index: ctx.examples,
    title: raw.title,
    problem: raw.blocks,
    solLabel: sol.title,
    sol: at < 0 ? sol.blocks : sol.blocks.slice(0, at),
    ans: at < 0 ? [] : sol.blocks.slice(at),
  };
}

function buildNode(
  raw: Raw,
  kind: 'section' | 'subtopic',
  ctx: Ctx,
  parent: ContentNode,
): ContentNode {
  const where = `${ctx.file}:${raw.line}`;
  const split = splitNumber(raw.title, kind === 'section' ? SECTION_RE : SUBTOPIC_RE);
  if (!split) {
    throw new Error(
      `${where}: ${kind === 'section' ? 'a ## heading must start with "N."' : 'a ### heading must be an example or start with "N.M"'}`,
    );
  }
  if (kind === 'subtopic' && !split.number.startsWith(`${parent.number}.`)) {
    throw new Error(
      `${where}: number ${split.number} does not belong under section ${parent.number}`,
    );
  }
  const id = `${ctx.page}/${split.number}`;
  const node: ContentNode = {
    id,
    kind,
    level: kind === 'section' ? 2 : 3,
    number: split.number,
    title: split.title,
    lead: [],
    explain: raw.blocks,
    examples: [],
    children: [],
    source: { file: ctx.file, line: raw.line },
  };
  let k = 0;
  for (const child of raw.children) {
    if (isExampleHeading(child.title)) {
      if (child.level !== raw.level + 1)
        throw new Error(`${ctx.file}:${child.line}: example heading at the wrong level`);
      node.examples.push(buildExample(child, id, ++k, ctx));
    } else if (kind === 'section') {
      node.children.push(buildNode(child, 'subtopic', ctx, node));
    } else {
      throw new Error(
        `${ctx.file}:${child.line}: a sub-topic can only contain examples ("${EXAMPLE_PREFIX}")`,
      );
    }
  }
  return node;
}

/** Turns the raw heading tree into the page tree and checks the structure. */
export function buildPage(
  raw: Raw,
  page: { id: string; file: string },
  warn: (m: string) => void,
): PageFile {
  const ctx: Ctx = { page: page.id, file: page.file, warn, examples: 0 };
  const first = raw.blocks[0];
  if (!first || first.t !== 'p')
    throw new Error(`${page.file}:${raw.line}: the title must be followed by a lead paragraph`);

  const root: ContentNode = {
    id: page.id,
    kind: 'page',
    level: 1,
    title: raw.title,
    lead: [first],
    explain: raw.blocks.slice(1),
    examples: [],
    children: [],
    source: { file: page.file, line: raw.line },
  };
  for (const child of raw.children) {
    if (isExampleHeading(child.title))
      throw new Error(`${ctx.file}:${child.line}: an example must sit under a section`);
    root.children.push(buildNode(child, 'section', ctx, root));
  }
  root.children.forEach((s, i) => {
    if (s.number !== String(i + 1))
      warn(`${page.file}:${s.source.line}: section number ${s.number} is not ${i + 1}`);
  });
  if (root.children.length === 0) throw new Error(`${page.file}: the page has no sections`);
  return { id: page.id, title: raw.title, root, stats: computeStats(root) };
}
