import type { Cell, CellAlign } from '../../src/content/types.ts';

export class HtmlError extends Error {}

const ALIGNS: Record<string, CellAlign> = { left: 'l', center: 'c', right: 'r' };

/** Reads an `align="..."` attribute; any other attribute is an error (CONTENT-SCHEMA.md section 6). */
export function readAlign(attrs: string, where: string, tag: string): CellAlign | undefined {
  const rest = attrs.trim();
  if (rest === '') return undefined;
  const m = /^align="(left|center|right)"$/.exec(rest);
  if (!m) throw new HtmlError(`${where}: unsupported attribute on <${tag}>: ${rest}`);
  return ALIGNS[m[1]];
}

type RawCell = { header: boolean; align?: CellAlign; html: string };

/**
 * Splits a `<table>...</table>` string into rows of raw cells. Only table, tr, th, td are allowed,
 * tags must be closed, nothing but whitespace may sit between them, tables cannot nest.
 */
export function splitTable(src: string, where: string): RawCell[][] {
  const text = src.trim();
  const open = /^<table((?:\s[^>]*)?)>/.exec(text);
  if (!open) throw new HtmlError(`${where}: table does not start with <table>`);
  readAlign(open[1], where, 'table');
  if (!text.endsWith('</table>')) throw new HtmlError(`${where}: table is not closed`);
  let body = text.slice(open[0].length, text.length - '</table>'.length);
  if (/<table/.test(body)) throw new HtmlError(`${where}: nested table`);

  const rows: RawCell[][] = [];
  while (body.trim() !== '') {
    const tr = /^\s*<tr>([\s\S]*?)<\/tr>/.exec(body);
    if (!tr)
      throw new HtmlError(`${where}: expected <tr> in table, found: ${body.trim().slice(0, 40)}`);
    body = body.slice(tr[0].length);
    const cells: RawCell[] = [];
    let row = tr[1];
    while (row.trim() !== '') {
      const cell = /^\s*<(th|td)((?:\s[^>]*)?)>([\s\S]*?)<\/\1>/.exec(row);
      if (!cell)
        throw new HtmlError(
          `${where}: expected <th> or <td> in row, found: ${row.trim().slice(0, 40)}`,
        );
      row = row.slice(cell[0].length);
      cells.push({
        header: cell[1] === 'th',
        align: readAlign(cell[2], where, cell[1]),
        html: cell[3],
      });
    }
    if (cells.length === 0) throw new HtmlError(`${where}: empty table row`);
    rows.push(cells);
  }
  if (rows.length === 0) throw new HtmlError(`${where}: table without rows`);
  const width = rows[0].length;
  rows.forEach((r, i) => {
    if (r.length !== width)
      throw new HtmlError(`${where}: table row ${i + 1} has ${r.length} cells, row 1 has ${width}`);
  });
  return rows;
}

/** Leading rows whose cells are all headers form the head; the rest are the body. */
export function splitHead(rows: Cell[][]): { head: Cell[][]; rows: Cell[][] } {
  let n = 0;
  while (n < rows.length && rows[n].every((c) => c.header)) n++;
  return { head: rows.slice(0, n), rows: rows.slice(n) };
}
