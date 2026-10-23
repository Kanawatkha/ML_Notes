import { INITIAL_STATE, type DiagramState } from './model';

/**
 * The open path of the diagram lives in the hash query, so a diagram state can be shared and
 * survives a reload (PLAN.md D16): `?p=classification:1,1.2/ex1` and `&x=1` when the example
 * column is open. After the topic id come the node ids with the topic prefix removed, separated
 * by commas. No `p` means the diagram is closed.
 */
export function stateToParams(state: DiagramState): URLSearchParams {
  const params = new URLSearchParams();
  if (!state.rootOpen) return params;
  const [topic, ...rest] = state.path;
  if (topic) {
    const prefix = `${topic}/`;
    const segments = rest.map((id) => (id.startsWith(prefix) ? id.slice(prefix.length) : id));
    params.set('p', [topic, segments.join(',')].filter(Boolean).join(':') || topic);
  } else {
    params.set('p', '');
  }
  if (state.examplesFor) params.set('x', '1');
  return params;
}

export function paramsToState(params: URLSearchParams, topics: readonly string[]): DiagramState {
  const p = params.get('p');
  if (p === null) return INITIAL_STATE;
  const [topic, rest = ''] = p.split(':');
  if (!topic || !topics.includes(topic)) return { rootOpen: true, path: [], examplesFor: null };
  const segments = rest ? rest.split(',').filter(Boolean) : [];
  const path = [topic, ...segments.map((s) => `${topic}/${s}`)];
  return {
    rootOpen: true,
    path,
    // the example column belongs to the deepest node of the path
    examplesFor: params.get('x') === '1' && segments.length > 0 ? path[path.length - 1] : null,
  };
}
