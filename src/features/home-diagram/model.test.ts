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
const open = (...path: string[]): DiagramState => ({ rootOpen: true, path });

describe('topics and nodes', () => {
  it('has one topic per page, in order, with the count of the nodes of its column', () => {
    expect(topics.map((t) => `${t.id}:${t.count}`)).toEqual([
      'regression:3',
      'classification:4',
      'clustering:1',
    ]);
    expect(topics.map((t) => t.id)).toEqual(PAGES.map((p) => p.id));
  });

  it('lists only the sections of a page, with no overview entry', () => {
    expect(pageNodes(fileOf('regression')).map((n) => n.id)).toEqual([
      'regression/1',
      'regression/2',
      'regression/3',
    ]);
    expect(pageNodes(fileOf('classification')).map((n) => n.id)).toEqual([
      'classification/1',
      'classification/2',
      'classification/3',
      'classification/4',
    ]);
  });

  it('gives K-NN its four distances as sub-topics and nothing else', () => {
    const knn = pageNodes(fileOf('classification'))[0];
    expect(knn.children.map((n) => n.id)).toEqual([
      'classification/1.1',
      'classification/1.2',
      'classification/1.3',
      'classification/1.4',
    ]);
    expect(knn.children.map((n) => n.read)).toEqual(['1.1', '1.2', '1.3', '1.4']);
  });

  it('has the exam-scope leaves: 3 regression, 4 distances, Perceptron, FFBP, ID3, K-Means', () => {
    const leaves = (id: 'regression' | 'classification' | 'clustering') =>
      leavesOf(pageNodes(fileOf(id))).map((n) => n.id);
    expect(leaves('regression')).toHaveLength(3);
    expect(leaves('classification')).toEqual([
      'classification/1.1',
      'classification/1.2',
      'classification/1.3',
      'classification/1.4',
      'classification/2',
      'classification/3',
      'classification/4',
    ]);
    expect(leaves('clustering')).toEqual(['clustering/1']);
  });

  it('links to the same part of the topic page', () => {
    expect(readHref('classification', '1.2')).toBe('/classification?s=1.2');
    expect(readHref('regression', '2')).toBe('/regression?s=2');
    expect(readHref('clustering', '')).toBe('/clustering');
  });
});

describe('opening and closing', () => {
  it('opens and closes the root; closing it forgets the path', () => {
    expect(toggleRoot(INITIAL_STATE)).toEqual({ rootOpen: true, path: [] });
    expect(toggleRoot(open('classification', 'classification/1'))).toEqual(INITIAL_STATE);
  });

  it('keeps one open node per column and closes the columns to the right of a closed node', () => {
    let s = toggleNode(open(), 1, 'classification');
    s = toggleNode(s, 2, 'classification/1');
    expect(s.path).toEqual(['classification', 'classification/1']);
    expect(toggleNode(s, 2, 'classification/1').path).toEqual(['classification']);
    expect(toggleNode(s, 1, 'regression').path).toEqual(['regression']);
    expect(toggleNode(s, 1, 'classification').path).toEqual([]);
  });

  it('closes the deepest open thing on Esc and says where focus goes', () => {
    const s = open('classification', 'classification/1');
    const a = closeDeepest(s);
    expect(a.state.path).toEqual(['classification']);
    expect(a.focusId).toBe('classification/1');
    const b = closeDeepest(a.state);
    expect(b.state.path).toEqual([]);
    expect(b.focusId).toBe('classification');
    const c = closeDeepest(b.state);
    expect(c.state).toEqual(INITIAL_STATE);
    expect(c.focusId).toBe('root');
    expect(closeDeepest(INITIAL_STATE).focusId).toBeNull();
  });
});

describe('columns', () => {
  it('has no columns while the root is closed', () => {
    expect(buildColumns(topics, files, INITIAL_STATE)).toEqual([]);
  });

  it('shows the topics when the root opens, then the sections of the open topic', () => {
    expect(kinds(open())).toEqual(['nodes']);
    expect(kinds(open('classification'))).toEqual(['nodes', 'nodes']);
  });

  it('opens a third column only for a group (K-NN), never for a leaf', () => {
    expect(kinds(open('classification', 'classification/1'))).toEqual(['nodes', 'nodes', 'nodes']);
    // a leaf in the path (an old shared link) opens nothing
    expect(kinds(open('classification', 'classification/2'))).toEqual(['nodes', 'nodes']);
    expect(kinds(open('regression', 'regression/1'))).toEqual(['nodes', 'nodes']);
  });

  it('turns every leaf into a link and leaves groups as buttons', () => {
    const columns = buildColumns(topics, files, open('classification', 'classification/1'));
    const second = columns[1];
    const third = columns[2];
    if (second.kind !== 'nodes' || third.kind !== 'nodes') throw new Error('expected nodes');
    expect(second.items.map((i) => i.href ?? null)).toEqual([
      null,
      '/classification?s=2',
      '/classification?s=3',
      '/classification?s=4',
    ]);
    expect(third.items.map((i) => i.href)).toEqual([
      '/classification?s=1.1',
      '/classification?s=1.2',
      '/classification?s=1.3',
      '/classification?s=1.4',
    ]);
    expect(second.openId).toBe('classification/1');
  });

  it('shows a loading or an error column while the topic file is not there', () => {
    expect(kinds(open('clustering'), {})).toEqual(['nodes', 'loading']);
    expect(kinds(open('clustering'), { clustering: 'loading' })).toEqual(['nodes', 'loading']);
    expect(kinds(open('clustering'), { clustering: 'error' })).toEqual(['nodes', 'error']);
  });

  it('shows only the topics for an unknown topic id', () => {
    expect(kinds(open('nope'))).toEqual(['nodes']);
  });
});
