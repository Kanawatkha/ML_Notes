import { createElement, type ReactNode } from 'react';
import { ExampleCard } from '@/components/content/ExampleCard';
import type { ContentNode, PageFile } from '@/content/types';
import { Overview, SectionPart } from './TopicParts';
import { estimateBlocks, estimateBlock } from '@/lib/estimate';

/**
 * A part of the page that is mounted as a whole: the overview, the heading and theory of a section
 * or sub-topic, or one example card. The page is a flat list of units in source order. A unit that
 * has not been mounted yet is a placeholder with the same id and an estimated height, so anchors
 * and jumps always find their target (TopicOutline.tsx).
 */
export type Unit = { id: string; estimate: number; render: () => ReactNode };

export const OVERVIEW_ID = (page: string) => `${page}/overview`;

/** Flattens a page into units. Examples are siblings of their section so each one can be mounted alone. */
export function buildUnits(file: PageFile): Unit[] {
  const units: Unit[] = [];
  const root = file.root;
  if (root.explain.length > 0) {
    const id = OVERVIEW_ID(file.id);
    units.push({
      id,
      estimate: estimateBlocks(root.explain) + 64,
      render: () => createElement(Overview, { id, blocks: root.explain }),
    });
  }
  const visit = (node: ContentNode) => {
    units.push({
      id: node.id,
      estimate: estimateBlocks(node.explain) + 80,
      render: () => createElement(SectionPart, { node, blocks: node.explain }),
    });
    const level = node.kind === 'section' ? 3 : 4;
    for (const block of node.examples) {
      if (block.t !== 'example') continue;
      units.push({
        id: block.id,
        estimate: estimateBlock(block),
        render: () => createElement(ExampleCard, { block, level, reveal: true }),
      });
    }
    node.children.forEach(visit);
  };
  root.children.forEach(visit);
  return units;
}
