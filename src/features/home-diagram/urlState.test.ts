import { describe, expect, it } from 'vitest';
import { INITIAL_STATE, type DiagramState } from './model';
import { paramsToState, stateToParams } from './urlState';

const TOPICS = ['regression', 'classification', 'clustering'];
const parse = (query: string) => paramsToState(new URLSearchParams(query), TOPICS);

describe('urlState', () => {
  it('writes nothing while the diagram is closed', () => {
    expect(stateToParams(INITIAL_STATE).toString()).toBe('');
  });

  it('writes the topic and the node ids without the topic prefix', () => {
    const state: DiagramState = {
      rootOpen: true,
      path: ['classification', 'classification/1', 'classification/1.2'],
      examplesFor: 'classification/1.2',
    };
    expect(decodeURIComponent(stateToParams(state).toString())).toBe('p=classification:1,1.2&x=1');
  });

  it('writes an open root and a bare topic', () => {
    expect(stateToParams({ rootOpen: true, path: [], examplesFor: null }).get('p')).toBe('');
    expect(
      stateToParams({ rootOpen: true, path: ['clustering'], examplesFor: null }).get('p'),
    ).toBe('clustering');
  });

  it('reads the same state back (round trip)', () => {
    for (const state of [
      { rootOpen: true, path: [], examplesFor: null },
      { rootOpen: true, path: ['clustering'], examplesFor: null },
      { rootOpen: true, path: ['regression', 'regression/overview'], examplesFor: null },
      {
        rootOpen: true,
        path: ['classification', 'classification/1', 'classification/1/overview'],
        examplesFor: null,
      },
      {
        rootOpen: true,
        path: ['classification', 'classification/4'],
        examplesFor: 'classification/4',
      },
    ] satisfies DiagramState[]) {
      expect(paramsToState(stateToParams(state), TOPICS)).toEqual(state);
    }
  });

  it('is closed without p, and open with no topic for an unknown topic', () => {
    expect(parse('')).toEqual(INITIAL_STATE);
    expect(parse('p=nope:1')).toEqual({ rootOpen: true, path: [], examplesFor: null });
    expect(parse('p=')).toEqual({ rootOpen: true, path: [], examplesFor: null });
  });

  it('ignores x without a node to hold the example column', () => {
    expect(parse('p=classification&x=1').examplesFor).toBeNull();
    expect(parse('p=classification:2&x=1').examplesFor).toBe('classification/2');
  });
});
