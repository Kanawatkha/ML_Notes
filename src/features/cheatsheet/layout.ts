/**
 * Which side of the sheet each box is on. The content of the boxes is the Markdown
 * (`content/midterm/CheatSheet.md`: section 1 the definitions and formulas of every topic, section
 * 2 the comparisons, every `###` is a box); this file only splits them over the two sides. Inside a
 * side the boxes flow in the order of the Markdown through COLUMNS columns, packed close together,
 * and the type size of the side is the largest at which everything still fits (`fit.ts`).
 */
export const SHEET_COLUMNS = 2;

/** 0 = front, 1 = back. */
export const SHEET_SIDE: Record<string, 0 | 1> = {
  'cheatsheet/1.1': 0,
  'cheatsheet/1.2': 0,
  'cheatsheet/1.3': 0,
  'cheatsheet/1.4': 0,
  'cheatsheet/1.5': 1,
  'cheatsheet/1.6': 1,
  'cheatsheet/1.7': 1,
  'cheatsheet/2.1': 0,
  'cheatsheet/2.2': 1,
  'cheatsheet/2.3': 1,
  'cheatsheet/2.4': 1,
  'cheatsheet/2.5': 1,
  'cheatsheet/2.6': 1,
};
