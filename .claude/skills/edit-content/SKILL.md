---
name: edit-content
description: Add or change study content in the Markdown files under content/midterm/ (Regression.md, Classification.md, Clustering.md) for the ML Notes site. Use whenever you write, edit, move or review theory, formulas, worked examples, HTML tables or SVG figures, or when the content pipeline reports a parse error.
---

# edit-content

Content is the only thing authors edit. The site is generated from it. `CONTENT-SCHEMA.md` is the full parser contract; this file is the working checklist.

## Where things live

- `content/midterm/Regression.md`: Linear, Nonlinear (Polynomial), K-NN Regression. The text before `## 1.` is the page lead and the shared formula overview.
- `content/midterm/Classification.md`: `## 1. K-NN` (group with sub-topics `### 1.1 Euclidean`, `1.2 Cosine`, `1.3 Squared Euclidean`, `1.4 Manhattan`), `## 2. Perceptron`, `## 3. FFBP`, `## 4. ID3`.
- `content/midterm/Clustering.md`: `## 1. K-Means`.
- `docs/` holds the lecturer's slides, notebooks and code: read them for reference, never link or render them.

## Workflow

1. Decide where the change belongs: theory and formulas go directly under the section or sub-topic heading, before its first example; a problem becomes an example.
2. Plan and discuss with the user first; write only when told.
3. Verify every number by program with the `verify-math` skill before saving.
4. Run `npm run content` (once the pipeline exists). Fix parse errors in the Markdown; extend the parser only for a legitimate new construct, and ask first.
5. Do not renumber sections or sub-topics without checking `?s=` links.

## Shapes

### Page

```
# Classification

**Classification (การจำแนกประเภท)** คือ...        <- lead paragraph (hero)

(optional overview: shared formulas)

---

## 1. K-NN
theory, **ขั้นตอน**, **สรุปสูตร** ...
### 1.1 Euclidean
formula
#### ตัวอย่างโจทย์
problem
##### Sol<sup>n</sup>
steps
**Ans** ...
```

- A section without sub-topics puts its examples at `###` with `#### Sol<sup>n</sup>`; inside a sub-topic, `####` with `##### Sol<sup>n</sup>`.
- Example headings start with `ตัวอย่างโจทย์` (`ตัวอย่างโจทย์ 2`, `ตัวอย่างโจทย์: กรณี $\det=0$`).
- Exercise headings start with `แบบฝึกหัด` (`แบบฝึกหัด 1`), at the same level as the examples of the node, after its examples, with the problem, then a `Sol<sup>n</sup>` heading one level below and the steps ending in `**Ans**`, exactly like an example (the page hides the solution behind a button). Check that the exercise is well posed by program (unique answer, no accidental ties, rounding to 2 decimals does not change an order or a label) before writing it.
- Separate examples with `---` (a blank line before it, never directly under a text line: that makes a setext heading).

### Writing style (hand-written exam style)

- Thai with English technical terms, concise.
- Steps: "จากสูตร" then the formula, substitute numbers step by step, "ดังนั้น" then the result, and finally `**Ans** ...`.
- Step labels as a bold lead: `**1. Forward** จากสูตร`, `**iter 2** Assign`. No "ขั้นที่ N" wording.
- Matrix sizes as a subscript at the lower right: `\begin{bmatrix}...\end{bmatrix}_{2\times2}`.
- No meta text about sources: never "ตามอาจารย์", "ตามสไลด์", "บนกระดาน", "หมายเหตุ" about where something came from. The notes read as an original document.

### Math (KaTeX)

- Inline `$...$`, display `$$...$$` on its own line. Never put formulas in code blocks.
- Thai inside math only inside `\text{...}`.
- Absolute values in running text and tables: `\lvert ... \rvert`.
- Must compile in KaTeX strict mode.

### Tables (HTML)

```html
<table align="center">
  <tr><th>D</th><th>c₁</th><th>c₂</th><th>Label</th></tr>
  <tr><th>x₁</th><td align="center">0</td><td align="center">3</td><td align="center">1</td></tr>
</table>
```

- Only `table`, `tr`, `th`, `td`, `b`, `align` attributes and `&nbsp;`. A `<th>` in a body row is a row header. Use `&nbsp;` for cells left blank on purpose.
- Use unicode subscripts (x₁, c₂) in cells rather than math.

### Figures (SVG)

- Inline `<svg>` inside `<div align="center">`, with `viewBox`, `role="img"` and an `aria-label` in Thai.
- `currentColor` and `none` only; no hex colours.
- **No blank lines anywhere inside the SVG or the wrapping `div`.**
- Render the SVG to an image and look at it before saving (labels clear of lines, nothing clipped).
- Never create separate image files.

## Pitfalls

- Backslashes: write files with the editor tools; shell heredocs and Python strings can collapse `\\` or turn `\t`, `\f` into control characters. After a scripted write, check that the file has no control characters other than newlines.
- `---` directly after a text line becomes a heading; always leave a blank line before it.
- A `|` inside math in a table cell can break rendering; use `\lvert`/`\rvert` or `\mid`.
- Keep one numbering style per file.
