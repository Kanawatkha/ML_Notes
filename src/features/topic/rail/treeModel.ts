import type { ContentNode, PageFile } from '@/content/types';
import { UI_TEXT } from '@/config/site';
import { plainText } from '@/lib/text';

export type RailKind = 'overview' | 'section' | 'subtopic' | 'example' | 'exercise';

/** One line of the contents: the overview, a section, a sub-topic or an example. */
export type RailEntry = {
  /** The id of the element on the page that the entry points at. */
  id: string;
  kind: RailKind;
  label: string;
  /** "1", "1.2" for sections and sub-topics. */
  number?: string;
  /** Running number of an example in the page, for the "EX 03" tag. */
  exIndex?: number;
  /** Running number of an exercise in the page, for the "PR 03" tag. */
  prIndex?: number;
  /** The section this entry is or sits in (the overview is its own section). */
  sectionId: string;
  /** The sub-topic this entry is or sits in. */
  subtopicId?: string;
  children: RailEntry[];
};

/** Where the reader is: the deepest entry reached, and the section and sub-topic it belongs to. */
export type ReadingPosition = { entryId: string; sectionId: string; subtopicId?: string };

const LABEL_MAX = 40;

function truncate(text: string): string {
  return text.length <= LABEL_MAX ? text : `${text.slice(0, LABEL_MAX - 1).trimEnd()}…`;
}

function exampleEntries(node: ContentNode, sectionId: string, subtopicId?: string): RailEntry[] {
  const examples = node.examples.flatMap((block) =>
    block.t !== 'example'
      ? []
      : [
          {
            id: block.id,
            kind: 'example' as const,
            label: truncate(plainText(block.title)),
            exIndex: block.index,
            sectionId,
            ...(subtopicId ? { subtopicId } : {}),
            children: [],
          },
        ],
  );
  const exercises = node.exercises.flatMap((block) =>
    block.t !== 'exercise'
      ? []
      : [
          {
            id: block.id,
            kind: 'exercise' as const,
            label: truncate(plainText(block.title)),
            prIndex: block.index,
            sectionId,
            ...(subtopicId ? { subtopicId } : {}),
            children: [],
          },
        ],
  );
  return [...examples, ...exercises];
}

/**
 * Builds the contents from the page: the overview (when the page has one), then each section with
 * its examples and sub-topics (and their examples) in page order. Entry ids are the ids of the
 * elements on the page, so selecting one is a jump to that id.
 */
export function buildRailTree(file: PageFile, overviewId: string): RailEntry[] {
  const entries: RailEntry[] = [];
  if (file.root.explain.length > 0) {
    entries.push({
      id: overviewId,
      kind: 'overview',
      label: UI_TEXT.overview,
      sectionId: overviewId,
      children: [],
    });
  }
  for (const section of file.root.children) {
    const sub = (node: ContentNode): RailEntry => ({
      id: node.id,
      kind: 'subtopic',
      label: truncate(plainText(node.title)),
      number: node.number,
      sectionId: section.id,
      subtopicId: node.id,
      children: exampleEntries(node, section.id, node.id),
    });
    entries.push({
      id: section.id,
      kind: 'section',
      label: truncate(plainText(section.title)),
      number: section.number,
      sectionId: section.id,
      children: [...exampleEntries(section, section.id), ...section.children.map(sub)],
    });
  }
  return entries;
}

/** Every entry in page order. */
export function flattenRail(entries: RailEntry[]): RailEntry[] {
  return entries.flatMap((e) => [e, ...flattenRail(e.children)]);
}

export function positionOf(entry: RailEntry): ReadingPosition {
  return {
    entryId: entry.id,
    sectionId: entry.sectionId,
    ...(entry.subtopicId ? { subtopicId: entry.subtopicId } : {}),
  };
}
