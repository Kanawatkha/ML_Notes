# CONTENT-SCHEMA

Rules for turning the three Markdown files into typed data. This is the contract between the content author and `scripts/build-content`. It is adapted from the 1322201 and NLP Notes schemas (same pipeline idea, same Inline model, KaTeX strict, SVG checks, round trip), extended for the shapes this content actually uses: HTML tables, a `Sol<sup>n</sup>` heading as the solution marker, an `**Ans**` paragraph, and examples that sit under a section or a sub-topic. Based on a scan of the current files.

## 1. Source files

| File | Page | Lines | Size |
|---|---|---|---|
| `content/midterm/Regression.md` | `#/regression` | 399 | 19 KB |
| `content/midterm/Classification.md` | `#/classification` | 1106 | 68 KB |
| `content/midterm/Clustering.md` | `#/clustering` | 243 | 13 KB |

They were moved from `Midterm_Summary/` to `content/midterm/` in Phase 1 (names unchanged; git records the rename when the move is committed). Pages are declared in `src/config/site.ts`:

```ts
export const PAGES = [
  { id: 'regression', route: '/regression', label: 'Regression', source: 'content/midterm/Regression.md', band: 'dark-navy', kind: 'supervised' },
  { id: 'classification', route: '/classification', label: 'Classification', source: 'content/midterm/Classification.md', band: 'deep-green', kind: 'supervised' },
  { id: 'clustering', route: '/clustering', label: 'Clustering', source: 'content/midterm/Clustering.md', band: 'primary', kind: 'unsupervised' },
] as const;
```

The pipeline reads exactly these sources and the reference page declared next to them. It never scans folders.

```ts
export const REFERENCE_PAGE = { id: 'definitions', route: '/definitions', label: 'นิยาม', source: 'content/midterm/Definitions.md' } as const;
```

`Definitions.md` uses the same shapes as the topic files (title and lead, `## 1.` and `## 2.` sections, `### N.M` sub-topics, HTML tables) and has no examples or exercises. It is built apart from the topics: it is in `result.extra`, not in `result.pages`, and not in `home.json`.

Current shape (use as the Phase 2 snapshot):

| Item | Regression | Classification | Clustering |
|---|---|---|---|
| `#` title | 1 | 1 | 1 |
| `##` sections | 3 | 4 | 1 |
| `###` numbered sub-topics | 0 | 4 (K-NN 1.1 to 1.4) | 0 |
| Examples (`ตัวอย่างโจทย์` headings) | 4 | 12 | 2 |
| `Sol<sup>n</sup>` headings / `**Ans**` paragraphs | 4 / 4 | 12 / 12 | 2 / 2 |
| HTML tables | 9 | 28 | 8 |
| SVG figures | 0 | 6 | 1 |
| Display math blocks | 73 | 123 | 37 |
| Lists (items) | 3 | 38 | 4 |
| `---` rules | 5 | 10 | 2 |
| Pipe tables, blockquotes, code | 0 | 0 | 0 |

## 2. Constructs the parser must support

| Construct | Markdown form | Notes |
|---|---|---|
| Title | `# Title` (one per file, first line) | Latin topic name |
| Section | `## N. Title` | Always numbered today |
| Sub-topic | `### N.M Title` | Numbered; only under a `##` |
| Example heading | `###`, `####` (any level from 3 to 4) whose text starts with `ตัวอย่างโจทย์` | `ตัวอย่างโจทย์`, `ตัวอย่างโจทย์ 2`, `ตัวอย่างโจทย์: กรณี $\det=0$` (math allowed in the title) |
| Sol marker | a heading one level below its example, whose text is exactly `Sol<sup>n</sup>` | `####` or `#####`; not a node |
| Exercise | a heading that starts with `แบบฝึกหัด`, at the same level as the examples of its node, followed by the problem, then exactly one Sol heading one level below it with the steps and an `**Ans**` paragraph (same shape as an example) | `###` under a section, `####` under a sub-topic |
| Ans | a paragraph that starts with `**Ans**` | Runs to the next heading, `---` or end of file |
| Paragraph | plain lines | Thai text with inline math and bold |
| Bold label paragraph | a paragraph that is only `**...**`, or starts with a bold label (`**1. Forward** จากสูตร`) | Flagged for styling (`label`, `step`), text unchanged |
| Inline math | `$...$` | KaTeX |
| Display math | `$$...$$` on its own line(s) | `bmatrix`, `array`, `aligned`, `underbrace`, `\lvert ... \rvert`, `\text{...}` with Thai inside |
| Bold | `**...**` | |
| Unordered / ordered list | `- item`, `1. item` | Items may contain inline math |
| HTML table | `<table align="center">` with `<tr>`, `<th>`, `<td align="...">` | See section 6 |
| Figure | `<div align="center">` + one `<svg>...</svg>` + `</div>` | See section 7 |
| Inline HTML | `<sup>` (only inside the Sol heading), `<b>` (inside table cells) | Anything else is an error |
| Entity | `&nbsp;` (empty table cells) | Decoded; an empty cell stays empty |
| Horizontal rule | `---` | Example and part separator; ignored for structure |

Anything else is a **parse error** with file and line, not silently dropped. Extend the parser and this table instead of changing the content. Heading level 6, a second `#`, a sub-topic outside a `##`, an example outside a section, a Sol heading outside an example, or two Sol headings in one example are errors.

## 3. Output data model (TypeScript)

Defined in `src/content/types.ts` and shared with the scripts (the file is the source of truth; this section summarises it).

```ts
type Inline =
  | { t: 'text'; v: string }
  | { t: 'strong'; c: Inline[] }
  | { t: 'code'; v: string }
  | { t: 'sup'; c: Inline[] }                            // only in the Sol label
  | { t: 'math'; tex: string; html: string };            // inline, KaTeX pre-rendered

type Cell = { header: boolean; align?: 'l' | 'c' | 'r'; c: Inline[] };

type Block =
  | { t: 'p'; c: Inline[]; label?: boolean; step?: boolean } // label: only a bold run; step: starts with a bold "1. ..." or "iter N" run
  | { t: 'math'; tex: string; html: string }            // display
  | { t: 'list'; ordered: boolean; items: { c: Inline[]; children: Block[] }[] }
  | { t: 'table'; head: Cell[][]; rows: Cell[][] }      // head = leading rows whose cells are all <th>
  | { t: 'figure'; svg: string; label: string }         // validated SVG markup; label from aria-label
  | { t: 'note'; c: Block[] }
  | { t: 'example'; id: string; index: number; title: Inline[]; problem: Block[]; solLabel: Inline[]; sol: Block[]; ans: Block[] }
  | { t: 'exercise'; id: string; index: number; title: Inline[]; problem: Block[]; solLabel: Inline[]; sol: Block[]; ans: Block[] };

type ContentNode = {
  id: string;              // "<page>", "<page>/1", "<page>/1.2"
  kind: 'page' | 'section' | 'subtopic';
  level: 1 | 2 | 3;
  number?: string;         // "1", "1.2"; absent on the page
  title: Inline[];         // the heading without its number
  lead: Block[];           // page only: the first paragraph
  explain: Block[];        // theory and formulas, never examples
  examples: Block[];       // the node's own examples (each an `example` block), in order
  exercises: Block[];      // the node's own exercises (each an `exercise` block), in order, after the examples
  children: ContentNode[];
  source: { file: string; line: number };
};

type PageStats = { sections: number; subtopics: number; leaves: number; examples: number; exercises: number };
type PageFile = { id: string; title: Inline[]; root: ContentNode; stats: PageStats };
type PageMeta = { id: string; title: Inline[]; lead: Block[]; stats: PageStats };
type OutlineNode = { id: string; kind: NodeKind; number?: string; title: Inline[]; explain: boolean; examples: number; exercises: number; children: OutlineNode[] };
type HomeFile = { pages: { id: string; title: Inline[]; outline: OutlineNode }[]; stats: { topics: number; leaves: number; examples: number; exercises: number } };
```

`home.json` carries only the outline (ids, numbers, titles, whether a node has its own explanation, example counts) and the stats; the Home diagram loads a page chunk when a topic is opened. `meta.json` is one object keyed by page id (title, lead, stats) so the heroes paint before the big chunk arrives.

Every `html` string is produced by `katex.renderToString(tex, { displayMode, throwOnError: true, strict: 'error', output: 'htmlAndMathml' })`. A failure fails the build.

## 4. Example detection

An **example** starts at a heading whose text begins with `ตัวอย่างโจทย์` and ends at the next heading of the same or a higher level, or at the end of its parent.

- `title` = the heading text (verbatim, may contain math). `index` = running number in the page (1, 2, ...), used for the `EX 01` chip.
- `problem` = blocks between the example heading and its Sol heading.
- `solLabel` = the Sol heading's inline content (`Sol` with a `sup` of `n`).
- `sol` = blocks after the Sol heading up to the `**Ans**` paragraph.
- `ans` = the `**Ans**` paragraph plus any blocks after it inside the example (today always just the paragraph).
- Every example must have exactly one Sol heading (error otherwise). An example without an `**Ans**` paragraph is valid (warning).
- A `---` inside an example is ignored.

An **exercise** starts at a heading whose text begins with `แบบฝึกหัด` and holds a problem (any blocks: text, tables, formulas, figures) and one Sol heading with its solution, parsed exactly like an example (a missing or second Sol heading is an error, and so is an exercise with no problem). The page shows the solution only when the reader opens that exercise's own button. Exercises attach to the nearest section or sub-topic above as `exercises`, with ids `<parent id>/pr<K>` (for example `classification/1.2/pr1`) and a running `index` per page. They come after the examples of their node (an example after an exercise is an error), and a section or sub-topic with exercises must have at least one example (tested). They are not part of the round-trip exceptions: their text and formulas are checked like everything else.

## 5. Node tree rules

1. The file's `#` heading is the **page** node (id `<page>`). Its first paragraph is `lead`. The remaining blocks before the first `##` are `explain` (the overview: Regression's shared formula summary). A `---` between them is ignored.
2. Each `## N. Title` is a **section** (id `<page>/N`, number `N`). Blocks directly under it before its first `###` are its `explain`.
3. Each `### N.M Title` is a **sub-topic** (id `<page>/N.M`), a child of its section. Its number must start with the section number (error otherwise). Blocks under it before its first example are its `explain`.
4. Example headings attach to the nearest section or sub-topic above them as `examples`. Example ids are `<parent id>/ex<K>` with `K` counted inside the parent (for example `classification/1.2/ex1`).
5. **Leaf** = a section or sub-topic without sub-topic children. **Group** = a section with sub-topic children (K-NN today). A group keeps its own `explain` (the K-NN steps and formula summary) and may also have examples (none today).
6. Diagram view (Home): a page or group whose `explain` is non-empty shows a synthetic first entry "ภาพรวม" that opens that `explain` as a block. Its id is `<node id>/overview`. The label is a UI string, not content.
7. Order is source order. Ids are stable while numbers are stable, so `?s=` links and tests do not change when wording changes.
8. The URL form of an id drops the page part: `?s=1.2`, `?s=1.2/ex1`, `?s=overview`.

Resulting tree today:

```
regression        overview, 1 Linear Regression (2 ex), 2 Nonlinear Regression (1 ex), 3 K-NN Regression (1 ex)
classification    1 K-NN [group: overview, 1.1 (1 ex), 1.2 (2 ex), 1.3 (2 ex), 1.4 (1 ex)], 2 Perceptron (2 ex), 3 FFBP (1 ex), 4 ID3 (3 ex)
clustering        1 K-Means (2 ex)
```

Leaves: 3 + 7 + 1 = 11. Examples: 4 + 12 + 2 = 18.

## 6. HTML tables

- Allowed: `<table>` (attribute `align` only), `<tr>`, `<th>` and `<td>` (attribute `align` only, values `left`, `center`, `right`), `<b>` inside cells, `&nbsp;`. Cell text may contain inline math and unicode subscripts (x₁).
- Leading rows whose cells are all `<th>` become `head`; the rest are `rows`. A `<th>` inside a body row is a row header (`header: true`), as in the distance tables (`D`, `x₁`).
- A cell that is empty or holds only `&nbsp;` is an empty cell (the blank D-table placeholders in K-NN and the blank cells of the Regression `sum` rows are kept on purpose).
- `align="center"` on the table is dropped; centering is done by CSS.
- The table is parsed as XML-like HTML; an unclosed tag, an unknown tag or attribute, or a nested table is an error.

## 7. Figures (SVG)

- Source form: `<div align="center">` containing one `<svg ...>...</svg>`, then `</div>`; no blank lines inside.
- The pipeline extracts the `<svg>` element as a string, validates it and stores a `figure` block. At render time it is inlined with `dangerouslySetInnerHTML` (trusted build output). The `<div>` wrapper is dropped.
- Validation (build error on failure): no blank line inside, well-formed XML, root has `viewBox` and `aria-label`, no `<script>`, no `on*` attributes, no external `href`, no hex or named colours (only `currentColor` and `none`), marker and other `id`s are rewritten to be unique per page (the FFBP figure defines `id="arr"`).
- The figure's accessible name is its `aria-label`.

## 8. Math

- Inline and display math are extracted before Markdown inline parsing so `_`, `*`, `|` inside formulas are not misread.
- Thai text inside math must be inside `\text{...}` (Regression uses `\text{โดย }`). KaTeX strict mode has no exceptions.
- Circled digits (the sample numbers in K-NN votes) are written `\text{\textcircled{3}}`, never the Unicode characters (①, ②, ...), which strict mode rejects. The build draws them as a round ring (a `ring` span styled in `content.css`) instead of KaTeX's lopsided oval; that macro is the only use of the html extension.
- Absolute values in table-adjacent text use `\lvert ... \rvert`; `|` is fine in display math.
- A lone `$` is never used outside math.

## 9. Generated output

```
src/content/generated/
  home.json             # HomeFile: outline of all pages and the stats (small)
  meta.json             # Record<page id, PageMeta>: title, lead, stats (for the heroes before the big chunk)
  regression.json       # PageFile
  classification.json   # PageFile
  clustering.json       # PageFile
  report.txt            # counts, warnings
```

Git-ignored. Regenerate with `npm run content`. The report lists, per page, node counts by kind, examples, tables, figures, formulas, and warnings. Counts are committed as a test snapshot (`TESTING.md` section 2).

## 10. Build-time checks (all fail the build)

1. Every declared file parses; unknown constructs, tags or attributes are errors.
2. Every formula compiles in KaTeX strict mode with no warning.
3. Every SVG passes section 7; every table passes section 6.
4. Every node id is unique; every number agrees with its parent.
5. Every example has exactly one Sol heading; no Sol heading or `**Ans**` paragraph appears outside an example. An exercise has exactly one of each, like an example.
6. Round trip: converting the data back to normalized text equals the normalized Markdown (see `TESTING.md`). The Sol headings, `---` rules, `<div>` wrappers and `&nbsp;` are accounted for explicitly.
7. Stats in `home.json` and `meta.json` equal the counts of the trees.

## 11. Author rules (what to keep doing in the Markdown)

- `# Title`, then the lead paragraph, then the overview (optional), then `## N. Title` sections.
- Sub-topics: `### N.M Title`, only when a section has several variants (K-NN distances).
- Examples: a heading starting with `ตัวอย่างโจทย์`, the problem, a heading `Sol<sup>n</sup>` one level below, the steps, then a paragraph starting with `**Ans**`.
- Steps: start with a bold label (`**1. Forward** จากสูตร`, `**iter 2** Assign`) so they get step styling.
- Tables: HTML `<table align="center">` with `<th>`/`<td align="center">`; `&nbsp;` for intentionally empty cells.
- Figures: SVG inside `<div align="center">`, `currentColor` only, an `aria-label`, no blank lines.
- Never add separate image files or an `images/` folder.
- Do not renumber sections or sub-topics without checking `?s=` links that may have been shared.

## 12. Implementation notes (Phase 2, done)

- Code: `scripts/build-content/` with `parse.ts` (blocks and inline, HTML tables and figures through `html.ts` and `svg.ts`), `tree.ts` (heading tree, node rules, example detection), `math.ts`, `project.ts` (round-trip oracle), `report.ts`, `index.ts` (`convertMarkdown` for one source, `buildContent`, `writeOutput`) and `run.ts` (the CLI behind `npm run content`). TypeScript runs directly on Node 24 (type stripping), so imports inside `scripts/` use `.ts` extensions.
- Headings from level 1 to 5 are accepted (level 5 only for the Sol heading of an example in a sub-topic); a child is always exactly one level below its parent.
- Math is pre-rendered with `output: 'htmlAndMathml'`. Measured for the current files (raw / gzip): Regression 741 KB / 34 KB, Classification 1374 KB / 61 KB, Clustering 306 KB / 14 KB, so every page chunk is far inside the 150 KB gzip budget. Most of the raw size is MathML.
- Round trip (`project.ts`): the Markdown and the generated data are both reduced to canonical text (whitespace removed), the ordered list of formulas, the figure count and the list of heading numbers. HTML tags, `&nbsp;`, `---` rules, bold markers and the numbers of headings are accounted for explicitly. Any difference fails `npm run content` and the tests (`tests/roundtrip.test.ts` also proves that a lost word or a changed formula is noticed).
- Warnings (an example without an `**Ans**` paragraph, a section number out of sequence) are printed in `generated/report.txt`. The current content produces none.
- The only change to the Markdown for the pipeline was the circled digits in K-NN votes (see section 8).
