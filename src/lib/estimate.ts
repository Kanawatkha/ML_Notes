import type { Block } from '@/content/types';

/**
 * Rough height in pixels of a block on a phone, used as the size of the placeholder that holds the
 * place of a part of the page that has not been mounted yet. It only has to be in the right range:
 * a good guess keeps the scroll bar and the jump targets from drifting while the parts are mounted.
 */
export function estimateBlock(block: Block): number {
  switch (block.t) {
    case 'p':
      return 56;
    case 'math':
      return 72;
    case 'list':
      return block.items.reduce(
        (sum, it) => sum + 34 + it.children.reduce((s, b) => s + estimateBlock(b), 0),
        0,
      );
    case 'table':
      return 24 + (block.head.length + block.rows.length) * 44;
    case 'figure':
      return 340;
    case 'note':
      return 32 + block.c.reduce((sum, b) => sum + estimateBlock(b), 0);
    case 'example':
      return (
        140 +
        [...block.problem, ...block.sol, ...block.ans].reduce((s, b) => s + estimateBlock(b), 0)
      );
    case 'exercise':
      return 150 + block.problem.reduce((s, b) => s + estimateBlock(b), 0);
  }
}

export function estimateBlocks(blocks: Block[]): number {
  return blocks.reduce((sum, b) => sum + estimateBlock(b) + 16, 0);
}
