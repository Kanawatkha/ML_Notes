import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';
import { buildContent } from '../scripts/build-content/index.ts';
import { walkBlocks, walkNodes } from '../scripts/build-content/tree.ts';
import { PAGES } from '../src/config/site.ts';
import type { Block } from '../src/content/types.ts';

const root = resolve(__dirname, '..');
const result = buildContent(root, PAGES);
const byId = Object.fromEntries(result.pages.map((p) => [p.file.id, p]));

describe('the real content', () => {
  it('converts without errors or warnings', () => {
    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([]);
    expect(result.pages.map((p) => p.file.id)).toEqual([
      'regression',
      'classification',
      'clustering',
    ]);
  });

  it('matches the counts snapshot (review any change)', () => {
    const counts = Object.fromEntries(result.pages.map((p) => [p.file.id, p.counts]));
    expect(counts).toEqual({
      regression: {
        sections: 3,
        subtopics: 0,
        leaves: 3,
        examples: 4,
        tables: 9,
        figures: 0,
        lists: 1,
        displayFormulas: 73,
        inlineFormulas: 108,
      },
      classification: {
        sections: 4,
        subtopics: 4,
        leaves: 7,
        examples: 12,
        tables: 28,
        figures: 6,
        lists: 11,
        displayFormulas: 123,
        inlineFormulas: 199,
      },
      clustering: {
        sections: 1,
        subtopics: 0,
        leaves: 1,
        examples: 2,
        tables: 8,
        figures: 1,
        lists: 1,
        displayFormulas: 37,
        inlineFormulas: 22,
      },
    });
  });

  it('has the expected tree and stable ids', () => {
    const ids = (id: string) => {
      const out: string[] = [];
      walkNodes(byId[id].file.root, (n) => out.push(n.id));
      return out;
    };
    expect(ids('regression')).toEqual([
      'regression',
      'regression/1',
      'regression/2',
      'regression/3',
    ]);
    expect(ids('classification')).toEqual([
      'classification',
      'classification/1',
      'classification/1.1',
      'classification/1.2',
      'classification/1.3',
      'classification/1.4',
      'classification/2',
      'classification/3',
      'classification/4',
    ]);
    expect(ids('clustering')).toEqual(['clustering', 'clustering/1']);
  });

  it('gives every example a problem, a Sol label, steps and an Ans paragraph', () => {
    let count = 0;
    for (const p of result.pages) {
      const indexes: number[] = [];
      walkNodes(p.file.root, (n) => {
        for (const b of n.examples) {
          if (b.t !== 'example') throw new Error('examples must hold example blocks');
          count++;
          indexes.push(b.index);
          expect(b.problem.length, b.id).toBeGreaterThan(0);
          expect(b.sol.length, b.id).toBeGreaterThan(0);
          expect(b.ans.length, b.id).toBeGreaterThan(0);
          expect(b.solLabel, b.id).toEqual([
            { t: 'text', v: 'Sol' },
            { t: 'sup', c: [{ t: 'text', v: 'n' }] },
          ]);
        }
      });
      expect(indexes, p.file.id).toEqual(indexes.map((_, i) => i + 1));
    }
    expect(count).toBe(18);
  });

  it('gives every page a lead paragraph and keeps examples out of explain', () => {
    for (const p of result.pages) {
      expect(p.file.root.lead).toHaveLength(1);
      walkNodes(p.file.root, (n) => {
        walkBlocks(n.explain, (b: Block) => {
          expect(b.t, `${n.id} explain`).not.toBe('example');
        });
      });
    }
  });

  it('keeps every table rectangular and every figure labelled with unique ids', () => {
    const seen = new Set<string>();
    for (const p of result.pages) {
      walkNodes(p.file.root, (n) => {
        walkBlocks([...n.explain, ...n.examples], (b) => {
          if (b.t === 'table') {
            const rows = [...b.head, ...b.rows];
            expect(new Set(rows.map((r) => r.length)).size, n.id).toBe(1);
          }
          if (b.t === 'figure') {
            expect(b.label.length).toBeGreaterThan(0);
            for (const m of b.svg.matchAll(/\sid="([^"]+)"/g)) {
              expect(seen.has(m[1]), m[1]).toBe(false);
              seen.add(m[1]);
            }
          }
        });
      });
    }
  });

  it('stays inside the size budget (gzip)', () => {
    for (const p of result.pages) {
      expect(gzipSync(p.json).length, p.file.id).toBeLessThan(150 * 1024);
    }
    expect(
      gzipSync(JSON.stringify(result.home)).length + gzipSync(JSON.stringify(result.meta)).length,
    ).toBeLessThan(10 * 1024);
  });

  it('derives the numbers of the heroes and of Home from the data', () => {
    expect(result.home.stats).toEqual({ topics: 3, leaves: 11, examples: 18 });
    expect(result.meta.classification.stats).toEqual({
      sections: 4,
      subtopics: 4,
      leaves: 7,
      examples: 12,
    });
    const knn = result.home.pages[1].outline.children[0];
    expect(knn).toMatchObject({ id: 'classification/1', explain: true, examples: 0 });
    expect(knn.children.map((c) => `${c.number}:${c.examples}`)).toEqual([
      '1.1:1',
      '1.2:2',
      '1.3:2',
      '1.4:1',
    ]);
  });
});

describe('the build', () => {
  it('reads only the declared sources, never a folder scan', () => {
    const dir = mkdtempSync(join(tmpdir(), 'ml-notes-'));
    mkdirSync(join(dir, 'content'));
    writeFileSync(join(dir, 'content', 'ok.md'), '# Ok\n\nLead.\n\n## 1. A\n\ntext\n');
    writeFileSync(join(dir, 'content', 'broken.md'), '# Broken\n\n<span>nope</span>\n');
    const r = buildContent(dir, [{ id: 'ok', source: 'content/ok.md' }]);
    expect(r.errors).toEqual([]);
    expect(r.pages).toHaveLength(1);
  });

  it('reports a missing source and a broken page instead of throwing', () => {
    const dir = mkdtempSync(join(tmpdir(), 'ml-notes-'));
    mkdirSync(join(dir, 'content'));
    writeFileSync(join(dir, 'content', 'broken.md'), '# Broken\n\nLead.\n\n<span>nope</span>\n');
    const r = buildContent(dir, [
      { id: 'gone', source: 'content/gone.md' },
      { id: 'broken', source: 'content/broken.md' },
    ]);
    expect(r.errors).toHaveLength(2);
    expect(r.errors[1]).toMatch(/broken\.md.*unsupported HTML/);
  });
});
