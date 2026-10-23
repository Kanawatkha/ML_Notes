import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { convertMarkdown } from '../scripts/build-content/index.ts';
import { parseDocument } from '../scripts/build-content/parse.ts';
import { projectData, projectMarkdown } from '../scripts/build-content/project.ts';
import { buildPage, buildRaw } from '../scripts/build-content/tree.ts';

const md = readFileSync(resolve(__dirname, '../content/midterm/Clustering.md'), 'utf8');

describe('round trip', () => {
  it('projects the Markdown and the data to the same text, formulas, figures and numbers', () => {
    const file = convertMarkdown(md, { id: 'clustering', file: 'Clustering.md' }, () => {});
    const a = projectMarkdown(md);
    const b = projectData(file);
    expect(b.text).toBe(a.text);
    expect(b.math).toEqual(a.math);
    expect(b.figures).toBe(a.figures);
    expect(b.numbers).toEqual(a.numbers);
  });

  it('notices a word that is lost on the way', () => {
    const raw = buildRaw(parseDocument(md, 'Clustering.md'), 'Clustering.md');
    const file = buildPage(raw, { id: 'clustering', file: 'Clustering.md' }, () => {});
    const lead = file.root.lead[0];
    if (lead.t !== 'p') throw new Error('lead must be a paragraph');
    lead.c = lead.c.slice(0, -1);
    expect(projectData(file).text).not.toBe(projectMarkdown(md).text);
  });

  it('notices a changed formula', () => {
    const raw = buildRaw(parseDocument(md, 'Clustering.md'), 'Clustering.md');
    const file = buildPage(raw, { id: 'clustering', file: 'Clustering.md' }, () => {});
    const section = file.root.children[0];
    const at = section.explain.findIndex((b) => b.t === 'math');
    const block = section.explain[at];
    if (block.t !== 'math') throw new Error('expected a formula');
    block.tex += '+1';
    expect(projectData(file).math).not.toEqual(projectMarkdown(md).math);
  });
});
