const SELF_CLOSING = /\/\s*>$/;
const PAINT_RE = /\s(fill|stroke)="([^"]*)"/g;

export type Figure = { svg: string; label: string };

/**
 * Extracts and validates the single <svg> element of a figure block.
 * Rules: CONTENT-SCHEMA.md section 7. Throws with a readable message on any violation.
 */
export function extractSvg(raw: string, where: string): Figure {
  const start = raw.indexOf('<svg');
  const end = raw.lastIndexOf('</svg>');
  if (start < 0 || end < 0) throw new Error(`${where}: figure block without <svg>`);
  const svg = raw.slice(start, end + '</svg>'.length);

  if (/\n[ \t]*\n/.test(svg)) throw new Error(`${where}: blank line inside <svg>`);
  const root = /^<svg[^>]*>/.exec(svg)?.[0] ?? '';
  if (!/\sviewBox="/.test(root)) throw new Error(`${where}: <svg> has no viewBox`);
  const label = /\saria-label="([^"]+)"/.exec(root)?.[1];
  if (!label) throw new Error(`${where}: <svg> has no aria-label`);
  if (/<script/i.test(svg)) throw new Error(`${where}: <script> inside <svg>`);
  if (/\son[a-z]+\s*=/i.test(svg))
    throw new Error(`${where}: event handler attribute inside <svg>`);
  if (/\s(?:xlink:)?href\s*=/i.test(svg)) throw new Error(`${where}: external href inside <svg>`);
  for (const m of svg.matchAll(PAINT_RE)) {
    const v = m[2];
    if (v !== 'currentColor' && v !== 'none' && !/^url\(#[\w-]+\)$/.test(v)) {
      throw new Error(`${where}: <svg> uses the colour "${v}" (only currentColor and none)`);
    }
  }

  const stack: string[] = [];
  for (const m of svg.matchAll(/<(\/?)([a-zA-Z][\w:-]*)([^>]*)>/g)) {
    const [whole, closing, name] = m;
    if (SELF_CLOSING.test(whole)) continue;
    if (closing) {
      const open = stack.pop();
      if (open !== name)
        throw new Error(`${where}: <svg> is not well formed (</${name}> closes <${open}>)`);
    } else {
      stack.push(name);
    }
  }
  if (stack.length > 0)
    throw new Error(`${where}: <svg> is not well formed (unclosed <${stack.pop()}>)`);
  return { svg, label };
}

/** Prefixes every id (and its url(#...) references) so figures never clash inside one page. */
export function uniquifyIds(svg: string, prefix: string): string {
  const ids = [...svg.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  let out = svg;
  for (const id of ids) {
    out = out.replaceAll(`id="${id}"`, `id="${prefix}-${id}"`);
    out = out.replaceAll(`url(#${id})`, `url(#${prefix}-${id})`);
  }
  return out;
}
