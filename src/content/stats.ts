import type { ContentNode, OutlineNode, PageStats } from './types';

/** Counts shown in the heroes, derived from the tree (never typed by hand). */
export function computeStats(root: ContentNode): PageStats {
  const s: PageStats = { sections: 0, subtopics: 0, leaves: 0, examples: 0, exercises: 0 };
  const visit = (n: ContentNode) => {
    if (n.kind === 'section') s.sections++;
    if (n.kind === 'subtopic') s.subtopics++;
    if (n.kind !== 'page' && n.children.length === 0) s.leaves++;
    s.examples += n.examples.length;
    s.exercises += n.exercises.length;
    n.children.forEach(visit);
  };
  visit(root);
  return s;
}

/** The tree without blocks, for the Home diagram. */
export function outlineOf(n: ContentNode): OutlineNode {
  return {
    id: n.id,
    kind: n.kind,
    ...(n.number ? { number: n.number } : {}),
    title: n.title,
    explain: n.explain.length > 0,
    examples: n.examples.length,
    exercises: n.exercises.length,
    children: n.children.map(outlineOf),
  };
}
