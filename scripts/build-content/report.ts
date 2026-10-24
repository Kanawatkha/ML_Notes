import type { ContentNode, Inline, PageFile } from '../../src/content/types.ts';
import { inlineText, walkBlocks, walkNodes } from './tree.ts';

/** Counts that the tests snapshot and the report prints. */
export type Counts = {
  sections: number;
  subtopics: number;
  leaves: number;
  examples: number;
  exercises: number;
  tables: number;
  figures: number;
  lists: number;
  displayFormulas: number;
  inlineFormulas: number;
};

export function countsOf(file: PageFile): Counts {
  const c: Counts = {
    sections: file.stats.sections,
    subtopics: file.stats.subtopics,
    leaves: file.stats.leaves,
    examples: file.stats.examples,
    exercises: file.stats.exercises,
    tables: 0,
    figures: 0,
    lists: 0,
    displayFormulas: 0,
    inlineFormulas: 0,
  };
  const inline = (list: Inline[]) => {
    for (const i of list) {
      if (i.t === 'math') c.inlineFormulas++;
      if (i.t === 'strong' || i.t === 'sup') inline(i.c);
    }
  };
  walkNodes(file.root, (n) => {
    inline(n.title);
    walkBlocks([...n.lead, ...n.explain, ...n.examples, ...n.exercises], (b) => {
      if (b.t === 'math') c.displayFormulas++;
      if (b.t === 'figure') c.figures++;
      if (b.t === 'p') inline(b.c);
      if (b.t === 'list') {
        c.lists++;
        for (const it of b.items) inline(it.c);
      }
      if (b.t === 'table') {
        c.tables++;
        for (const row of [...b.head, ...b.rows]) for (const cell of row) inline(cell.c);
      }
      if (b.t === 'example') {
        inline(b.title);
        inline(b.solLabel);
      }
      if (b.t === 'exercise') inline(b.title);
    });
  });
  return c;
}

function line(n: ContentNode, depth: number): string[] {
  const pad = '  '.repeat(depth);
  const label = `${n.number ?? ''} ${inlineText(n.title)}`.trim();
  const out = [
    `${pad}[${n.kind}] ${n.id}  ${label}  (explain ${n.explain.length} blocks, ${n.examples.length} examples, ${n.exercises.length} exercises, ${n.children.length} children)`,
  ];
  for (const c of n.children) out.push(...line(c, depth + 1));
  return out;
}

export type ReportEntry = {
  file: PageFile;
  source: string;
  counts: Counts;
  bytes: number;
  gzipBytes: number;
};

/** Human-readable report: counts, the full tree with ids, sizes, warnings. */
export function renderReport(entries: ReportEntry[], warnings: string[]): string {
  const out: string[] = ['CONTENT REPORT', ''];
  for (const { file, source, counts: c, bytes, gzipBytes } of entries) {
    out.push(`Page "${file.id}"  (${source})`);
    out.push(`  title: ${inlineText(file.title)}`);
    out.push(
      `  sections ${c.sections}, sub-topics ${c.subtopics}, leaves ${c.leaves}, examples ${c.examples}, exercises ${c.exercises}, tables ${c.tables}, figures ${c.figures}, lists ${c.lists}, display formulas ${c.displayFormulas}, inline formulas ${c.inlineFormulas}`,
    );
    out.push(
      `  generated JSON: ${(bytes / 1024).toFixed(1)} KB, ${(gzipBytes / 1024).toFixed(1)} KB gzip`,
    );
    out.push('', 'Tree');
    out.push(...line(file.root, 1));
    out.push('');
  }
  out.push(`Warnings (${warnings.length})`);
  for (const w of warnings) out.push(`  - ${w}`);
  out.push('');
  return out.join('\n');
}
