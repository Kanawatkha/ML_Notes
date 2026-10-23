import { describe, expect, it } from 'vitest';
import { PAGES } from '@/config/site';
import { fileOf, homeFile } from '@/test/content';
import {
  INITIAL_STATE,
  buildColumns,
  closeDeepest,
  leavesOf,
  pageNodes,
  readHref,
  toggleExamples,
  toggleNode,
  toggleRoot,
  topicItems,
  type DiagramState,
  type FileStatus,
} from './model';

const topics = topicItems(homeFile);
const files: Record<string, FileStatus> = {
  regression: fileOf('regression'),
  classification: fileOf('classification'),
  clustering: fileOf('clustering'),
};
const kinds = (s: DiagramState, f: Record<string, FileStatus> = files) =>
  buildColumns(topics, f, s).map((c) => c.kind);
const open = (...path: string[]): DiagramState => ({ rootOpen: true, path, examplesFor: null });

describe('topics and nodes', () => {
  it('has one topic per page, in order, with the count of the nodes of its column', () => {
    expect(topics.map((t) => `${t.id}:${t.count}`)).toEqual([
      'regression:4',
      'classification:4',
      'clustering:1',
    ]);
    expect(topics.map((t) => t.id)).toEqual(PAGES.map((p) => p.id));
  });

  it('puts an overview entry first when the page has one, then the sections', () => {
    const regression = pageNodes(fileOf('regression'));
    expect(regression.map((n) => `${n.id}:${n.overview ? 'overview' : 'section'}`)).toEqual([
      'regression/overview:overview',
      'regression/1:section',
      'regression/2:section',
      'regression/3:section',
    ]);
    expect(pageNodes(fileOf('classification'))[0].overview).toBeUndefined();
  });

  it('gives a group section an overview entry for its own explanation, then its sub-topics', () => {
    const knn = pageNodes(fileOf('classification'))[0];
    expect(knn.children.map((n) => n.id)).toEqual([
      'classification/1/overview',
      'classification/1.1',
      'classification/1.2',
      'classification/1.3',
      'classification/1.4',
    ]);
    expect(knn.children[0]).toMatchObject({ overview: true, read: '1' });
    expect(knn.children[0].explain.length).toBeGreaterThan(0);
    expect(knn.explain).toEqual([]);
  });

  it('finds every leaf: 11 topics of the exam plus the 2 overview entries of Regression and K-NN', () => {
    const leaves = PAGES.flatMap((p) => leavesOf(pageNodes(fileOf(p.id))));
    expect(leaves).toHaveLength(11 + 2);
    expect(leaves.filter((l) => l.overview)).toHaveLength(2);
    expect(leaves.reduce((n, l) => n + l.examples.length, 0)).toBe(18);
  });

  it('links to the matching part of the topic page', () => {
    expect(readHref('classification', '1.2')).toBe('/classification?s=1.2');
    expect(readHref('regression', 'overview')).toBe('/regression?s=overview');
  });
});

describe('diagram state', () => {
  it('toggles the root and clears everything when it closes', () => {
    const opened = toggleRoot(INITIAL_STATE);
    expect(opened.rootOpen).toBe(true);
    expect(toggleRoot({ ...opened, path: ['classification'], examplesFor: 'x' })).toEqual(
      INITIAL_STATE,
    );
  });

  it('keeps one open node per column and closes everything to the right of a closed node', () => {
    let s = toggleNode(open(), 1, 'classification');
    s = toggleNode(s, 2, 'classification/1');
    s = toggleNode(s, 3, 'classification/1.2');
    expect(s.path).toEqual(['classification', 'classification/1', 'classification/1.2']);
    // another node in column 2 replaces it and everything after it
    expect(toggleNode(s, 2, 'classification/2').path).toEqual([
      'classification',
      'classification/2',
    ]);
    // pressing the open node closes it and the columns after it
    expect(toggleNode(s, 2, 'classification/1').path).toEqual(['classification']);
    expect(toggleNode(s, 1, 'classification').path).toEqual([]);
  });

  it('closes the example column when the path changes', () => {
    const s = toggleExamples(open('classification', 'classification/2'), 'classification/2');
    expect(s.examplesFor).toBe('classification/2');
    expect(toggleNode(s, 2, 'classification/3').examplesFor).toBeNull();
    expect(toggleExamples(s, 'classification/2').examplesFor).toBeNull();
  });

  it('closes the deepest open thing on Esc and says where focus goes', () => {
    const withExamples = {
      ...open('classification', 'classification/2'),
      examplesFor: 'classification/2',
    };
    expect(closeDeepest(withExamples)).toEqual({
      state: open('classification', 'classification/2'),
      focusId: 'ex:classification/2',
    });
    expect(closeDeepest(open('classification', 'classification/2'))).toEqual({
      state: open('classification'),
      focusId: 'classification/2',
    });
    expect(closeDeepest(open())).toEqual({ state: INITIAL_STATE, focusId: 'root' });
    expect(closeDeepest(INITIAL_STATE)).toEqual({ state: INITIAL_STATE, focusId: null });
  });
});

describe('buildColumns', () => {
  it('shows nothing while the root is closed and the topics once it is open', () => {
    expect(kinds(INITIAL_STATE)).toEqual([]);
    expect(kinds(open())).toEqual(['nodes']);
  });

  it('shows a loading column while the page of a topic is on its way, and an error column on failure', () => {
    expect(kinds(open('classification'), {})).toEqual(['nodes', 'loading']);
    expect(kinds(open('classification'), { classification: 'loading' })).toEqual([
      'nodes',
      'loading',
    ]);
    expect(kinds(open('classification'), { classification: 'error' })).toEqual(['nodes', 'error']);
  });

  it('opens the sections of a topic, then the sub-topics of a group, then the block of a leaf', () => {
    expect(kinds(open('classification'))).toEqual(['nodes', 'nodes']);
    expect(kinds(open('classification', 'classification/1'))).toEqual(['nodes', 'nodes', 'nodes']);
    expect(kinds(open('classification', 'classification/1', 'classification/1.2'))).toEqual([
      'nodes',
      'nodes',
      'nodes',
      'block',
    ]);
    // a leaf section has no third node column
    expect(kinds(open('classification', 'classification/2'))).toEqual(['nodes', 'nodes', 'block']);
  });

  it('adds the example column only for a leaf with examples whose button is open', () => {
    const leaf = open('classification', 'classification/2');
    expect(kinds({ ...leaf, examplesFor: 'classification/2' })).toEqual([
      'nodes',
      'nodes',
      'block',
      'examples',
    ]);
    // an overview entry has no examples, so the flag changes nothing
    const overview = open('regression', 'regression/overview');
    expect(kinds({ ...overview, examplesFor: 'regression/overview' })).toEqual([
      'nodes',
      'nodes',
      'block',
    ]);
  });

  it('builds the breadcrumb of a block from the topic and the nodes of the path', () => {
    const columns = buildColumns(
      topics,
      files,
      open('classification', 'classification/1', 'classification/1.2'),
    );
    const block = columns[columns.length - 1];
    expect(block.kind).toBe('block');
    if (block.kind === 'block') expect(block.crumb).toBe('Classification / 1 K-NN / 1.2 Cosine');
  });

  it('stops at an id that does not exist instead of failing', () => {
    expect(kinds(open('classification', 'classification/9'))).toEqual(['nodes', 'nodes']);
    expect(kinds(open('nope'))).toEqual(['nodes']);
  });
});
