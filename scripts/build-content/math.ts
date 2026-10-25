import katex from 'katex';

const cache = new Map<string, string>();

/**
 * The circled sample numbers of the K-NN votes (textcircled with the digit) are drawn by KaTeX as
 * a lopsided oval, so the command is replaced by a plain span with the class `ring`, which
 * content.css turns into a true circle. The html class command needs `trust`, which is granted for
 * that one command and a short list of classes only: `ring`, and the pen colours of the cheat
 * sheet (`pen-red`, `pen-blue`, `hl` for a highlighter stroke).
 */
const macros = { '\\textcircled': '\\htmlClass{ring}{#1}' };
const TRUSTED_CLASSES = ['ring', 'pen-red', 'pen-blue', 'hl'];
const trust = (context: { command: string; class?: string }) =>
  context.command === '\\htmlClass' && TRUSTED_CLASSES.includes(context.class ?? '');

/** Pre-renders TeX to HTML (plus MathML for screen readers) with KaTeX. Strict mode: any problem fails the build. */
export function renderMath(tex: string, display: boolean): string {
  const key = `${display ? 'D' : 'I'}:${tex}`;
  const hit = cache.get(key);
  if (hit !== undefined) return hit;
  const html = katex.renderToString(tex, {
    displayMode: display,
    throwOnError: true,
    output: 'htmlAndMathml',
    // everything is an error, except the html extension that the ring macro above relies on
    strict: (code: string) => (code === 'htmlExtension' ? 'ignore' : 'error'),
    macros: { ...macros },
    trust,
  });
  cache.set(key, html);
  return html;
}
