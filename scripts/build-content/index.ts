import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import type { HomeFile, PageFile, PageMeta } from '../../src/content/types.ts';
import { outlineOf } from '../../src/content/stats.ts';
import { parseDocument } from './parse.ts';
import { projectData, projectMarkdown } from './project.ts';
import { countsOf, renderReport, type Counts } from './report.ts';
import { uniquifyIds } from './svg.ts';
import { buildPage, buildRaw, walkBlocks, walkNodes } from './tree.ts';

/** A page to build: its id and the Markdown source, relative to the project root. */
export type PageSource = { readonly id: string; readonly source: string };

export type BuiltPage = {
  file: PageFile;
  source: string;
  counts: Counts;
  json: string;
};

export type BuildResult = {
  pages: BuiltPage[];
  home: HomeFile;
  meta: Record<string, PageMeta>;
  warnings: string[];
  errors: string[];
  report: string;
};

/** Gives every figure of a page its own id prefix so SVG ids never clash on one page. */
function uniquifyFigures(file: PageFile): void {
  let k = 0;
  walkNodes(file.root, (n) => {
    walkBlocks([...n.lead, ...n.explain, ...n.examples], (b) => {
      if (b.t === 'figure') b.svg = uniquifyIds(b.svg, `${file.id}-f${++k}`);
    });
  });
}

/** Checks of CONTENT-SCHEMA.md section 10 that need the whole tree. */
function checkTree(file: PageFile, rel: string, errors: string[]): void {
  const seen = new Set<string>();
  walkNodes(file.root, (n) => {
    if (seen.has(n.id)) errors.push(`${rel}: duplicate node id ${n.id}`);
    seen.add(n.id);
    walkBlocks(n.examples, (b) => {
      if (b.t !== 'example') return;
      if (seen.has(b.id)) errors.push(`${rel}: duplicate example id ${b.id}`);
      seen.add(b.id);
    });
  });
}

function compare(a: string[], b: string[]): number {
  if (a.length !== b.length) return Math.min(a.length, b.length);
  return a.findIndex((x, i) => x !== b[i]);
}

/**
 * Converts one Markdown source into its page tree and proves the round trip. Throws on the first
 * problem (parse, tree or round trip) with a readable message; `warn` collects soft problems.
 */
export function convertMarkdown(
  md: string,
  page: { id: string; file: string },
  warn: (m: string) => void,
): PageFile {
  const rel = page.file;
  const file = buildPage(buildRaw(parseDocument(md, rel), rel), page, warn);

  // round trip: Markdown and generated data must project to the same text, formulas, figures, numbers
  const a = projectMarkdown(md);
  const b = projectData(file);
  const problems: string[] = [];
  if (a.text !== b.text) {
    let k = 0;
    while (k < a.text.length && a.text[k] === b.text[k]) k++;
    problems.push(
      `round-trip text mismatch at char ${k}
    md  : ...${a.text.slice(Math.max(0, k - 20), k + 40)}
    data: ...${b.text.slice(Math.max(0, k - 20), k + 40)}`,
    );
  }
  if (a.figures !== b.figures) problems.push(`figure count md=${a.figures} data=${b.figures}`);
  const mi = compare(a.math, b.math);
  if (mi >= 0)
    problems.push(
      `formula mismatch (md ${a.math.length}, data ${b.math.length}) first diff at #${mi}: ${a.math[mi]} | ${b.math[mi]}`,
    );
  const ni = compare(a.numbers, b.numbers);
  if (ni >= 0)
    problems.push(
      `heading numbers differ (md ${a.numbers.join(',')} | data ${b.numbers.join(',')})`,
    );
  if (problems.length > 0) throw new Error(`${rel}: ${problems.join('; ')}`);

  uniquifyFigures(file);
  const dup: string[] = [];
  checkTree(file, rel, dup);
  if (dup.length > 0) throw new Error(dup.join('; '));
  return file;
}

/** Converts every declared page. Reads only `pages[].source`, never scans folders. Never writes. */
export function buildContent(root: string, pages: readonly PageSource[]): BuildResult {
  const warnings: string[] = [];
  const errors: string[] = [];
  const built: BuiltPage[] = [];

  for (const page of pages) {
    const rel = page.source;
    try {
      const md = readFileSync(join(root, page.source), 'utf8');
      const file = convertMarkdown(md, { id: page.id, file: rel }, (m) => warnings.push(m));
      built.push({ file, source: rel, counts: countsOf(file), json: JSON.stringify(file) });
    } catch (e) {
      errors.push(
        e instanceof Error && e.message.startsWith(rel)
          ? e.message
          : `${rel}: ${e instanceof Error ? e.message : String(e)}`,
      );
    }
  }

  const home: HomeFile = {
    pages: built.map((p) => ({
      id: p.file.id,
      title: p.file.title,
      outline: outlineOf(p.file.root),
    })),
    stats: {
      topics: built.length,
      leaves: built.reduce((n, p) => n + p.file.stats.leaves, 0),
      examples: built.reduce((n, p) => n + p.file.stats.examples, 0),
    },
  };
  const meta: Record<string, PageMeta> = {};
  for (const p of built) {
    meta[p.file.id] = {
      id: p.file.id,
      title: p.file.title,
      lead: p.file.root.lead,
      stats: p.file.stats,
    };
  }

  const report = renderReport(
    built.map((p) => ({
      file: p.file,
      source: p.source,
      counts: p.counts,
      bytes: Buffer.byteLength(p.json),
      gzipBytes: gzipSync(p.json).length,
    })),
    warnings,
  );
  return { pages: built, home, meta, warnings, errors, report };
}

export function writeOutput(result: BuildResult, outDir: string): void {
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  for (const p of result.pages) writeFileSync(join(outDir, `${p.file.id}.json`), p.json);
  writeFileSync(join(outDir, 'home.json'), JSON.stringify(result.home));
  writeFileSync(join(outDir, 'meta.json'), JSON.stringify(result.meta));
  writeFileSync(join(outDir, 'report.txt'), result.report);
}
