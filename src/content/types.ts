/**
 * Data model produced by scripts/build-content and consumed by the React app.
 * Shared by both sides, so it must stay free of runtime code. See CONTENT-SCHEMA.md.
 */

export type Inline =
  | { t: 'text'; v: string }
  | { t: 'strong'; c: Inline[] }
  | { t: 'code'; v: string }
  | { t: 'sup'; c: Inline[] }
  | { t: 'math'; tex: string; html: string };

/** Table cell alignment. */
export type CellAlign = 'l' | 'c' | 'r';

export type Cell = { header: boolean; align?: CellAlign; c: Inline[] };

export type ListItem = { c: Inline[]; children: Block[] };

export type Block =
  /** `label`: the paragraph is only a bold run. `step`: it starts with a bold "1. ..." or "iter N" run. */
  | { t: 'p'; c: Inline[]; label?: boolean; step?: boolean }
  | { t: 'math'; tex: string; html: string }
  | { t: 'list'; ordered: boolean; items: ListItem[] }
  /** `head` holds the leading rows whose cells are all headers; a header cell in a body row is a row header. */
  | { t: 'table'; head: Cell[][]; rows: Cell[][] }
  | { t: 'figure'; svg: string; label: string }
  | { t: 'note'; c: Block[] }
  | {
      t: 'example';
      /** "<node id>/ex<K>". */
      id: string;
      /** Running number in the page, for the "EX 01" chip. */
      index: number;
      title: Inline[];
      problem: Block[];
      /** The heading of the solution, `Sol` with a superscript `n`. */
      solLabel: Inline[];
      sol: Block[];
      /** The paragraph that starts with a bold "Ans" and anything after it. May be empty. */
      ans: Block[];
    };

/**
 * page      the `#` heading
 * section   `## N. Title`
 * subtopic  `### N.M Title` under a section
 */
export type NodeKind = 'page' | 'section' | 'subtopic';

export type ContentNode = {
  /** "<page>", "<page>/1", "<page>/1.2". */
  id: string;
  kind: NodeKind;
  level: 1 | 2 | 3;
  /** "1", "1.2". Absent on the page. */
  number?: string;
  /** The heading without its number. */
  title: Inline[];
  /** Page only: the first paragraph (the lead of the hero). */
  lead: Block[];
  /** Theory and formulas. Never examples. */
  explain: Block[];
  /** The node's own worked examples, in order (each is an `example` block). */
  examples: Block[];
  children: ContentNode[];
  source: { file: string; line: number };
};

export type PageStats = {
  sections: number;
  subtopics: number;
  /** Sections and sub-topics without sub-topics. */
  leaves: number;
  examples: number;
};

export type PageFile = {
  /** The page id from PAGES in src/config/site.ts. */
  id: string;
  title: Inline[];
  root: ContentNode;
  stats: PageStats;
};

/** What the top of a topic page needs, in a small file so it paints before the big chunk. */
export type PageMeta = {
  id: string;
  title: Inline[];
  lead: Block[];
  stats: PageStats;
};

/** One node of the outline used by the Home diagram: no blocks, only what the diagram lays out. */
export type OutlineNode = {
  id: string;
  kind: NodeKind;
  number?: string;
  title: Inline[];
  /** The node has its own explanation (the diagram shows an "overview" entry for it). */
  explain: boolean;
  examples: number;
  children: OutlineNode[];
};

export type HomeFile = {
  pages: { id: string; title: Inline[]; outline: OutlineNode }[];
  stats: { topics: number; leaves: number; examples: number };
};
