import { describe, expect, it } from 'vitest';
import { fileOf } from '@/test/content';
import { buildUnits, OVERVIEW_ID } from '../units';
import { buildRailTree, flattenRail, positionOf } from './treeModel';

const tree = (id: Parameters<typeof fileOf>[0]) => buildRailTree(fileOf(id), OVERVIEW_ID(id));

describe('buildRailTree', () => {
  it('has the same entries, in the same order, as the parts of the page', () => {
    for (const id of ['regression', 'classification', 'clustering'] as const) {
      const flat = flattenRail(tree(id)).map((e) => e.id);
      expect(flat, id).toEqual(buildUnits(fileOf(id)).map((u) => u.id));
    }
  });

  it('starts with the overview only when the page has one', () => {
    expect(tree('regression')[0]).toMatchObject({ kind: 'overview', id: 'regression/overview' });
    expect(tree('classification')[0].kind).toBe('section');
  });

  it('puts the examples of a section before its sub-topics, and the examples of a sub-topic inside it', () => {
    const knn = tree('classification')[0];
    expect(knn).toMatchObject({
      id: 'classification/1',
      kind: 'section',
      number: '1',
      label: 'K-NN',
    });
    expect(knn.children.map((c) => c.id)).toEqual([
      'classification/1.1',
      'classification/1.2',
      'classification/1.3',
      'classification/1.4',
    ]);
    const cosine = knn.children[1];
    expect(cosine).toMatchObject({
      kind: 'subtopic',
      number: '1.2',
      subtopicId: 'classification/1.2',
    });
    expect(cosine.children.map((c) => `${c.kind}:${c.exIndex ?? c.prIndex}`)).toEqual([
      'example:3',
      'example:4',
      'exercise:3',
      'exercise:4',
    ]);

    const perceptron = tree('classification')[1];
    expect(perceptron.children.map((c) => c.kind)).toEqual([
      'example',
      'example',
      'exercise',
      'exercise',
      'exercise',
    ]);
    expect(perceptron.children[0]).toMatchObject({
      label: 'ตัวอย่างโจทย์ 1',
      sectionId: 'classification/2',
    });
  });

  it('gives the position of an entry with its section and sub-topic', () => {
    const cosineExample = tree('classification')[0].children[1].children[0];
    expect(positionOf(cosineExample)).toEqual({
      entryId: 'classification/1.2/ex1',
      sectionId: 'classification/1',
      subtopicId: 'classification/1.2',
    });
    expect(positionOf(tree('clustering')[0])).toEqual({
      entryId: 'clustering/1',
      sectionId: 'clustering/1',
    });
  });
});
