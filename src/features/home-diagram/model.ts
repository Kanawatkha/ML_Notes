import { PAGES, UI_TEXT, type PageId } from '@/config/site';
import type { Block, ContentNode, HomeFile, Inline, PageFile } from '@/content/types';
import { plainText } from '@/lib/text';

/** What the student has opened. Column 1 shows the topics, so `path[0]` is a page id, and so on. */
export type DiagramState = {
  rootOpen: boolean;
  path: string[];
  /** Id of the leaf whose example column is open. */
  examplesFor: string | null;
};

export const INITIAL_STATE: DiagramState = { rootOpen: false, path: [], examplesFor: null };

export const ROOT_ID = 'root';

/** Link to the matching part of the topic page. */
export const readHref = (page: PageId, read: string) =>
  `/${page}${read ? `?s=${encodeURIComponent(read).replaceAll('%2F', '/')}` : ''}`;

export const examplesButtonId = (leafId: string) => `ex:${leafId}`;

export type FileStatus = PageFile | 'loading' | 'error';

/**
 * A node of the diagram below the topic: a section, a sub-topic, or an "overview" entry that holds
 * the explanation of a page or of a group section. A node without children is a leaf and opens
 * its block (explanation and formulas) and, if it has examples, the example column.
 */
export type DNode = {
  id: string;
  number?: string;
  title: Inline[];
  explain: Block[];
  examples: Block[];
  children: DNode[];
  overview?: boolean;
  /** The `?s=` value of the matching part of the topic page. */
  read: string;
};

/** A topic of column 1: what the home file and the page config say before the page is loaded. */
export type TopicItem = {
  id: PageId;
  title: Inline[];
  label: string;
  band: (typeof PAGES)[number]['band'];
  kind: (typeof PAGES)[number]['kind'];
  /** Number of nodes in column 2 (the overview counts), shown under the title. */
  count: number;
};

export type NodeItem = {
  id: string;
  number?: string;
  title: Inline[];
  tone: 'topic' | 'item' | 'overview';
  topic?: TopicItem;
};

export type Column =
  | { kind: 'nodes'; index: number; parentId: string; items: NodeItem[]; openId: string | null }
  | { kind: 'loading'; index: number; parentId: string; page: PageId }
  | { kind: 'error'; index: number; parentId: string; page: PageId }
  | { kind: 'block'; index: number; parentId: string; page: PageId; node: DNode; crumb: string }
  | { kind: 'examples'; index: number; parentId: string; page: PageId; node: DNode };

const overviewTitle: Inline[] = [{ t: 'text', v: UI_TEXT.overview }];

function leaf(node: ContentNode): DNode {
  return {
    id: node.id,
    number: node.number,
    title: node.title,
    explain: node.explain,
    examples: node.examples,
    children: [],
    read: node.number ?? '',
  };
}

function section(node: ContentNode): DNode {
  if (node.children.length === 0) return leaf(node);
  const overview: DNode[] =
    node.explain.length > 0 || node.examples.length > 0
      ? [
          {
            id: `${node.id}/overview`,
            title: overviewTitle,
            explain: node.explain,
            examples: node.examples,
            children: [],
            overview: true,
            read: node.number ?? '',
          },
        ]
      : [];
  return {
    id: node.id,
    number: node.number,
    title: node.title,
    explain: [],
    examples: [],
    children: [...overview, ...node.children.map(leaf)],
    read: node.number ?? '',
  };
}

/** The nodes of column 2 for a loaded page: the overview of the page (when it has one), then its sections. */
export function pageNodes(file: PageFile): DNode[] {
  const overview: DNode[] =
    file.root.explain.length > 0
      ? [
          {
            id: `${file.id}/overview`,
            title: overviewTitle,
            explain: file.root.explain,
            examples: [],
            children: [],
            overview: true,
            read: 'overview',
          },
        ]
      : [];
  return [...overview, ...file.root.children.map(section)];
}

/** Topics of column 1 from the home file and the page config (the order of PAGES). */
export function topicItems(home: HomeFile): TopicItem[] {
  return PAGES.flatMap((page) => {
    const entry = home.pages.find((p) => p.id === page.id);
    if (!entry) return [];
    const root = entry.outline;
    const count = root.children.length + (root.explain ? 1 : 0);
    return [
      {
        id: page.id,
        title: entry.title,
        label: page.label,
        band: page.band,
        kind: page.kind,
        count,
      },
    ];
  });
}

const topicNodeItem = (topic: TopicItem): NodeItem => ({
  id: topic.id,
  title: topic.title,
  tone: 'topic',
  topic,
});

const toItem = (node: DNode): NodeItem => ({
  id: node.id,
  number: node.number,
  title: node.title,
  tone: node.overview ? 'overview' : 'item',
});

export function toggleRoot(state: DiagramState): DiagramState {
  return state.rootOpen ? INITIAL_STATE : { ...state, rootOpen: true };
}

/** Opens or closes a node of column `column` (1 or more). Closing also closes everything to its right. */
export function toggleNode(state: DiagramState, column: number, id: string): DiagramState {
  const keep = state.path.slice(0, column - 1);
  const wasOpen = state.path[column - 1] === id;
  return { ...state, path: wasOpen ? keep : [...keep, id], examplesFor: null };
}

export function toggleExamples(state: DiagramState, leafId: string): DiagramState {
  return { ...state, examplesFor: state.examplesFor === leafId ? null : leafId };
}

/** Esc: closes the deepest open thing. `focusId` is the control that should receive focus next. */
export function closeDeepest(state: DiagramState): { state: DiagramState; focusId: string | null } {
  if (state.examplesFor) {
    return { state: { ...state, examplesFor: null }, focusId: examplesButtonId(state.examplesFor) };
  }
  if (state.path.length > 0) {
    return {
      state: { ...state, path: state.path.slice(0, -1) },
      focusId: state.path[state.path.length - 1],
    };
  }
  if (state.rootOpen) return { state: INITIAL_STATE, focusId: ROOT_ID };
  return { state, focusId: null };
}

/** The columns right of the root. A node with children opens a node column, a leaf opens its block. */
export function buildColumns(
  topics: TopicItem[],
  files: Record<string, FileStatus>,
  state: DiagramState,
): Column[] {
  if (!state.rootOpen) return [];
  const columns: Column[] = [];
  const topicId = state.path[0];
  columns.push({
    kind: 'nodes',
    index: 1,
    parentId: ROOT_ID,
    items: topics.map(topicNodeItem),
    openId: topicId ?? null,
  });
  const topic = topics.find((t) => t.id === topicId);
  if (!topic) return columns;

  const file = files[topic.id];
  if (file === undefined || file === 'loading') {
    columns.push({ kind: 'loading', index: 2, parentId: topic.id, page: topic.id });
    return columns;
  }
  if (file === 'error') {
    columns.push({ kind: 'error', index: 2, parentId: topic.id, page: topic.id });
    return columns;
  }

  let siblings = pageNodes(file);
  let parentId: string = topic.id;
  const crumb: string[] = [topic.label];
  for (let index = 2; ; index++) {
    const openId = state.path[index - 1] ?? null;
    columns.push({ kind: 'nodes', index, parentId, items: siblings.map(toItem), openId });
    const open = openId ? siblings.find((n) => n.id === openId) : undefined;
    if (!open) return columns;
    crumb.push(`${open.number ?? ''} ${plainText(open.title)}`.trim());
    if (open.children.length === 0) {
      columns.push({
        kind: 'block',
        index: index + 1,
        parentId: open.id,
        page: topic.id,
        node: open,
        crumb: crumb.join(' / '),
      });
      if (state.examplesFor === open.id && open.examples.length > 0) {
        columns.push({
          kind: 'examples',
          index: index + 2,
          parentId: examplesButtonId(open.id),
          page: topic.id,
          node: open,
        });
      }
      return columns;
    }
    siblings = open.children;
    parentId = open.id;
  }
}

/** Key that changes when a column is replaced, so the enter animation runs for it. */
export function columnKey(column: Column): string {
  return `${column.kind}:${column.parentId}`;
}

/** Every leaf of a page's diagram, in order (used by tests and by the topic cards). */
export function leavesOf(nodes: DNode[]): DNode[] {
  return nodes.flatMap((n) => (n.children.length === 0 ? [n] : leavesOf(n.children)));
}
