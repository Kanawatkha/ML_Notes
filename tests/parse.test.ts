import { describe, expect, it } from 'vitest';
import { convertMarkdown } from '../scripts/build-content/index.ts';
import { extractSvg, uniquifyIds } from '../scripts/build-content/svg.ts';
import type { Block, ContentNode, Inline } from '../src/content/types.ts';

function convert(md: string) {
  const warnings: string[] = [];
  const file = convertMarkdown(md, { id: 't', file: 't.md' }, (m) => warnings.push(m));
  return { file, warnings };
}

const text = (c: Inline[]): string =>
  c
    .map((i) => {
      if (i.t === 'text' || i.t === 'code') return i.v;
      if (i.t === 'strong' || i.t === 'sup') return text(i.c);
      return `$${i.tex}$`;
    })
    .join('');

const FIGURE = String.raw`<div align="center">
<svg viewBox="0 0 10 10" role="img" aria-label="Arrow figure" xmlns="http://www.w3.org/2000/svg">
<defs><marker id="arr" viewBox="0 0 8 8" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="currentColor"/></marker></defs>
<line x1="1" y1="1" x2="9" y2="9" stroke="currentColor" marker-end="url(#arr)"/>
</svg>
</div>`;

const RICH = String.raw`# Topic

Lead paragraph with $x^2$.

**Overview label**

$$y=ax+b$$

---

## 1. Alpha

Theory $a+b$.

**1. Step** do it

### ตัวอย่างโจทย์

Problem text

<table align="center">
  <tr><th></th><th>x₁</th></tr>
  <tr><th>1</th><td align="center">&nbsp;</td></tr>
  <tr><td></td><td align="center"><b>2.4</b></td></tr>
</table>

#### Sol<sup>n</sup>

**iter 1** step

$$z=1$$

**Ans** $z=1$

---

## 2. Beta

### 2.1 Gamma

formula $q$

#### ตัวอย่างโจทย์ 2: กรณี $\det=0$

p

##### Sol<sup>n</sup>

steps only

### 2.2 Delta

${FIGURE}
`;

function find(n: ContentNode, id: string): ContentNode | undefined {
  if (n.id === id) return n;
  for (const c of n.children) {
    const f = find(c, id);
    if (f) return f;
  }
  return undefined;
}

describe('page tree', () => {
  const { file, warnings } = convert(RICH);

  it('builds ids, kinds and numbers', () => {
    const root = file.root;
    expect(root.id).toBe('t');
    expect(root.kind).toBe('page');
    expect(root.children.map((c) => c.id)).toEqual(['t/1', 't/2']);
    expect(root.children[1].children.map((c) => `${c.id}:${c.number}`)).toEqual([
      't/2.1:2.1',
      't/2.2:2.2',
    ]);
    expect(text(find(root, 't/2.1')!.title)).toBe('Gamma');
  });

  it('takes the first paragraph as the lead and the rest before ## as the overview', () => {
    expect(file.root.lead).toHaveLength(1);
    expect(file.root.explain.map((b) => b.t)).toEqual(['p', 'math']);
    expect(file.root.explain[0]).toMatchObject({ t: 'p', label: true });
  });

  it('attaches examples to the nearest section or sub-topic', () => {
    const alpha = find(file.root, 't/1')!;
    const gamma = find(file.root, 't/2.1')!;
    const ex1 = alpha.examples[0] as Extract<Block, { t: 'example' }>;
    const ex2 = gamma.examples[0] as Extract<Block, { t: 'example' }>;
    expect(ex1.id).toBe('t/1/ex1');
    expect(ex2.id).toBe('t/2.1/ex1');
    expect([ex1.index, ex2.index]).toEqual([1, 2]);
    expect(text(ex2.title)).toBe(String.raw`ตัวอย่างโจทย์ 2: กรณี $\det=0$`);
    expect(text(ex1.solLabel)).toBe('Soln');
  });

  it('splits Sol steps from the Ans paragraph and warns about a missing Ans', () => {
    const ex1 = find(file.root, 't/1')!.examples[0] as Extract<Block, { t: 'example' }>;
    expect(ex1.sol.map((b) => b.t)).toEqual(['p', 'math']);
    expect(ex1.ans).toHaveLength(1);
    const ex2 = find(file.root, 't/2.1')!.examples[0] as Extract<Block, { t: 'example' }>;
    expect(ex2.ans).toHaveLength(0);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toMatch(/without an "Ans"/);
  });

  it('flags step paragraphs', () => {
    const ex1 = find(file.root, 't/1')!.examples[0] as Extract<Block, { t: 'example' }>;
    expect(ex1.sol[0]).toMatchObject({ t: 'p', step: true });
    expect(find(file.root, 't/1')!.explain[1]).toMatchObject({ t: 'p', step: true });
  });

  it('counts sections, sub-topics, leaves and examples', () => {
    expect(file.stats).toEqual({ sections: 2, subtopics: 2, leaves: 3, examples: 2, exercises: 0 });
  });
});

describe('exercises', () => {
  const md = String.raw`# T

Lead.

## 1. Alpha

Theory.

### ตัวอย่างโจทย์

Problem

#### Sol<sup>n</sup>

steps

**Ans** x

### แบบฝึกหัด 1

First problem $x^2$

<table align="center">
  <tr><th>#</th><th>x</th></tr>
  <tr><td align="center">1</td><td align="center">2</td></tr>
</table>

### แบบฝึกหัด 2

Second problem

## 2. Beta

### 2.1 Gamma

#### แบบฝึกหัด 1

Problem under a sub-topic
`;
  const { file } = convert(md);

  it('keeps an exercise as a heading and a problem, with the ids pr1, pr2 and a running index', () => {
    const alpha = find(file.root, 't/1')!;
    const gamma = find(file.root, 't/2.1')!;
    const ex = alpha.exercises as Extract<Block, { t: 'exercise' }>[];
    expect(ex.map((b) => [b.id, b.index])).toEqual([
      ['t/1/pr1', 1],
      ['t/1/pr2', 2],
    ]);
    expect(text(ex[0].title)).toBe('แบบฝึกหัด 1');
    expect(ex[0].problem.map((b) => b.t)).toEqual(['p', 'table']);
    expect((gamma.exercises[0] as Extract<Block, { t: 'exercise' }>).id).toBe('t/2.1/pr1');
    expect((gamma.exercises[0] as Extract<Block, { t: 'exercise' }>).index).toBe(3);
  });

  it('counts exercises apart from examples', () => {
    expect(file.stats).toMatchObject({ examples: 1, exercises: 3 });
    expect(find(file.root, 't/1')!.examples).toHaveLength(1);
  });
});

describe('tables', () => {
  const { file } = convert(RICH);
  const ex = find(file.root, 't/1')!.examples[0] as Extract<Block, { t: 'example' }>;
  const table = ex.problem.find((b) => b.t === 'table') as Extract<Block, { t: 'table' }>;

  it('splits the head from the body and keeps row headers', () => {
    expect(table.head).toHaveLength(1);
    expect(table.rows).toHaveLength(2);
    expect(table.rows[0][0]).toMatchObject({ header: true });
    expect(table.rows[0][1]).toMatchObject({ header: false, align: 'c' });
  });

  it('keeps empty cells and turns &nbsp; into an empty cell', () => {
    expect(table.head[0][0].c).toEqual([]);
    expect(table.rows[0][1].c).toEqual([]);
    expect(table.rows[1][0].c).toEqual([]);
  });

  it('reads <b> as strong text', () => {
    expect(table.rows[1][1].c).toEqual([{ t: 'strong', c: [{ t: 'text', v: '2.4' }] }]);
  });
});

describe('figures', () => {
  const fig = FIGURE;
  it('keeps the label and prefixes ids so figures never clash', () => {
    const { svg, label } = extractSvg(fig, 'x');
    expect(label).toBe('Arrow figure');
    const out = uniquifyIds(svg, 't-f1');
    expect(out).toContain('id="t-f1-arr"');
    expect(out).toContain('url(#t-f1-arr)');
    expect(out).not.toContain('id="arr"');
  });

  it('rewrites ids inside a converted page', () => {
    const { file } = convert(RICH);
    const delta = find(file.root, 't/2.2')!;
    const figure = delta.explain.find((b) => b.t === 'figure') as Extract<Block, { t: 'figure' }>;
    expect(figure.svg).toContain('id="t-f1-arr"');
    expect(figure.label).toBe('Arrow figure');
  });

  it.each([
    [
      'a colour other than currentColor or none',
      '<svg viewBox="0 0 1 1" aria-label="a"><path stroke="#fff"/></svg>',
      /colour/,
    ],
    ['no aria-label', '<svg viewBox="0 0 1 1"><path/></svg>', /aria-label/],
    ['no viewBox', '<svg aria-label="a"><path/></svg>', /viewBox/],
    ['a blank line', '<svg viewBox="0 0 1 1" aria-label="a">\n\n<path/></svg>', /blank line/],
    ['a script', '<svg viewBox="0 0 1 1" aria-label="a"><script></script></svg>', /script/],
    [
      'an event handler',
      '<svg viewBox="0 0 1 1" aria-label="a"><path onclick="x"/></svg>',
      /event handler/,
    ],
    ['an unclosed element', '<svg viewBox="0 0 1 1" aria-label="a"><g></svg>', /well formed/],
  ])('rejects %s', (_name, svg, re) => {
    expect(() => extractSvg(svg, 'x')).toThrow(re);
  });
});

describe('errors', () => {
  const base = '# T\n\nLead.\n\n## 1. A\n\ntext\n';
  const example = (sol: string) => `${base}\n### ตัวอย่างโจทย์\n\nproblem\n\n${sol}\n`;

  it.each([
    ['an unknown tag in text', `${base}\nhello <span>x</span>\n`, /unsupported HTML/],
    [
      'an unknown table tag',
      `${base}\n<table><tr><td><i>x</i></td></tr></table>\n`,
      /unsupported HTML/,
    ],
    [
      'an unclosed cell',
      `${base}\n<table>\n<tr><td>x</tr>\n</table>\n`,
      /expected <th> or <td>|<td>/,
    ],
    [
      'an unsupported attribute',
      `${base}\n<table><tr><td style="x">x</td></tr></table>\n`,
      /unsupported attribute/,
    ],
    [
      'a table with ragged rows',
      `${base}\n<table><tr><td>1</td><td>2</td></tr><tr><td>1</td></tr></table>\n`,
      /cells/,
    ],
    ['a Markdown pipe table', `${base}\n| a | b |\n|---|---|\n`, /pipe tables/],
    ['heading level 6', `${base}\n###### x\n`, /not supported/],
    ['a heading that skips a level', `${base}\n#### x\n`, /directly under/],
    ['a section without a number', '# T\n\nLead.\n\n## Alpha\n', /N\./],
    ['a sub-topic with the wrong number', `${base}\n### 2.1 B\n`, /does not belong/],
    ['a sub-topic heading that is not an example or N.M', `${base}\n### Something\n`, /N\.M/],
    ['no lead paragraph', '# T\n\n## 1. A\n', /lead paragraph/],
    ['an example without Sol', `${base}\n### ตัวอย่างโจทย์\n\nproblem\n`, /Sol/],
    ['two Sol headings', example('#### Sol<sup>n</sup>\n\na\n\n#### Sol<sup>n</sup>\n\nb'), /Sol/],
    ['a Sol heading with a wrong title', example('#### Solution\n\na'), /Sol/],
    ['a Sol heading at the wrong level', example('##### Sol<sup>n</sup>\n\na'), /directly under/],
    ['math that KaTeX rejects', `${base}\n$$\\notamacro$$\n`, /KaTeX/],
    ['Thai outside \\text in math', `${base}\n$ก$\n`, /KaTeX/],
    ['unmatched dollar', `${base}\nprice $5\n`, /unmatched/],
    ['a second title', `${base}\n# Again\n`, /exactly one level-1/],
  ])('rejects %s', (_name, md, re) => {
    expect(() => convert(md)).toThrow(re);
  });

  it.each([
    [
      'a Sol heading below an exercise',
      `${base}\n### แบบฝึกหัด 1\n\nproblem\n\n#### Sol<sup>n</sup>\n\na\n`,
      /no solution/,
    ],
    ['an exercise without a problem', `${base}\n### แบบฝึกหัด 1\n`, /needs a problem/],
    [
      'an example after an exercise',
      `${base}\n### แบบฝึกหัด 1\n\nproblem\n\n### ตัวอย่างโจทย์\n\np\n\n#### Sol<sup>n</sup>\n\na\n`,
      /before the exercises/,
    ],
    [
      'an exercise outside a section',
      '# T\n\nLead.\n\n## แบบฝึกหัด 1\n\nproblem\n',
      /must sit under a section/,
    ],
  ])('rejects %s', (_name, md, re) => {
    expect(() => convert(md)).toThrow(re);
  });

  it('accepts a minimal page', () => {
    const { file, warnings } = convert(`${example('#### Sol<sup>n</sup>\n\nsteps\n\n**Ans** x')}`);
    expect(file.stats.examples).toBe(1);
    expect(warnings).toEqual([]);
  });
});
