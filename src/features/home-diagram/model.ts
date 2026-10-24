import { PAGES, type PageId } from '@/config/site';
import type { ContentNode, HomeFile, Inline, PageFile } from '@/content/types';

/** What the student has opened. Column 1 shows the topics, so `path[0]` is a page id, and so on. */
export type DiagramState = {
  rootOpen: boolean;
  path: string[];
};

export const INITIAL_STATE: DiagramState = { rootOpen: false, path: [] };

export const ROOT_ID = 'root';

/** Link to the matching part of the topic page. */
export const readHref = (page: PageId, read: string) =>
  `/${page}${read ? `?s=${encodeURIComponent(read).replaceAll('%2F', '/')}` : ''}`;

export type FileStatus = PageFile | 'loading' | 'error';

/**
 * A node of the diagram below the topic: a section or a sub-topic. A node with children opens the
 * next column; a node without children is a leaf and links to its part of the topic page.
 */
export type DNode = {
  id: string;
  number?: string;
  title: Inline[];
  children: DNode[];
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
  /** Number of nodes in column 2, shown under the title. */
  count: number;
};

export type NodeItem = {
  id: string;
  number?: string;
  title: Inline[];
  tone: 'topic' | 'item';
  topic?: TopicItem;
  /** Set on a leaf: where the node leads, instead of opening a column. */
  href?: string;
};

export type Column =
  | { kind: 'nodes'; index: number; parentId: string; items: NodeItem[]; openId: string | null }
  | { kind: 'loading'; index: number; parentId: string; page: PageId }
  | { kind: 'error'; index: number; parentId: string; page: PageId };

function toNode(node: ContentNode): DNode {
  return {
    id: node.id,
    number: node.number,
    title: node.title,
    children: node.children.map(toNode),
    read: node.number ?? '',
  };
}

/** The nodes of column 2 for a loaded page: its sections, in order. */
export function pageNodes(file: PageFile): DNode[] {
  return file.root.children.map(toNode);
}

/** Topics of column 1 from the home file and the page config (the order of PAGES). */
export function topicItems(home: HomeFile): TopicItem[] {
  return PAGES.flatMap((page) => {
    const entry = home.pages.find((p) => p.id === page.id);
    if (!entry) return [];
    return [
      {
        id: page.id,
        title: entry.title,
        label: page.label,
        band: page.band,
        kind: page.kind,
        count: entry.outline.children.length,
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

const toItem =
  (page: PageId) =>
  (node: DNode): NodeItem => ({
    id: node.id,
    number: node.number,
    title: node.title,
    tone: 'item',
    href: node.children.length === 0 ? readHref(page, node.read) : undefined,
  });

export function toggleRoot(state: DiagramState): DiagramState {
  return state.rootOpen ? INITIAL_STATE : { ...state, rootOpen: true };
}

/** Opens or closes a node of column `column` (1 or more). Closing also closes everything to its right. */
export function toggleNode(state: DiagramState, column: number, id: string): DiagramState {
  const keep = state.path.slice(0, column - 1);
  const wasOpen = state.path[column - 1] === id;
  return { ...state, path: wasOpen ? keep : [...keep, id] };
}

/** Esc: closes the deepest open thing. `focusId` is the control that should receive focus next. */
export function closeDeepest(state: DiagramState): { state: DiagramState; focusId: string | null } {
  if (state.path.length > 0) {
    return {
      state: { ...state, path: state.path.slice(0, -1) },
      focusId: state.path[state.path.length - 1],
    };
  }
  if (state.rootOpen) return { state: INITIAL_STATE, focusId: ROOT_ID };
  return { state, focusId: null };
}

/** The columns right of the root. A node with children opens a node column; a leaf is a link. */
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
  for (let index = 2; ; index++) {
    const openId = state.path[index - 1] ?? null;
    const open = openId
      ? siblings.find((n) => n.id === openId && n.children.length > 0)
      : undefined;
    columns.push({
      kind: 'nodes',
      index,
      parentId,
      items: siblings.map(toItem(topic.id)),
      openId: open ? open.id : null,
    });
    if (!open) return columns;
    siblings = open.children;
    parentId = open.id;
  }
}

/** Key that changes when a column is replaced, so the enter animation runs for it. */
export function columnKey(column: Column): string {
  return `${column.kind}:${column.parentId}`;
}

/** Every leaf of a page's diagram, in order (used by tests). */
export function leavesOf(nodes: DNode[]): DNode[] {
  return nodes.flatMap((n) => (n.children.length === 0 ? [n] : leavesOf(n.children)));
}
