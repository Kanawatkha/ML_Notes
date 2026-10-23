# ML Notes

Midterm study notes for course 1322308 Machine Learning: formulas and fully worked hand-calculation examples for Regression, Classification and Clustering. A static, frontend-only site with an interactive exam-scope diagram on Home, one long page per topic with a contents rail, and offline support.

Live site: https://kanawatkha.github.io/ML_Notes/

Status: all phases of `PLAN.md` are done and version 1.0.0 is live.

## What is in it

| Page | Source Markdown | Content |
|---|---|---|
| Home | all three files | Diagram: Midterm, topics, sections, sub-topics, then formulas and examples; topic cards |
| Regression | `content/midterm/Regression.md` | Linear, Polynomial, K-NN Regression |
| Classification | `content/midterm/Classification.md` | K-NN (four distances), Perceptron, FFBP, ID3 |
| Clustering | `content/midterm/Clustering.md` | K-Means |

## Editing content

All text lives in Markdown under `content/midterm/`. Never edit generated files.

1. Edit a file, following `CONTENT-SCHEMA.md` (section headings, `ตัวอย่างโจทย์` examples, a `Sol<sup>n</sup>` heading, an `**Ans**` paragraph, HTML tables, inline SVG).
2. Verify every number by program (`.claude/skills/verify-math/SKILL.md`).
3. Check locally:

```bash
npm run content
```

   The build script converts Markdown to typed data and fails on bad KaTeX, a bad table or SVG, an unknown construct, or anything that does not round-trip back to the Markdown.
4. Preview with `npm run dev`.
5. Commit and push to `main`. GitHub Actions lints, tests, builds and publishes the site.

## Commands

```bash
npm ci                 # install exactly from the lockfile (Node 24, see .nvmrc)
npm run dev            # content + dev server
npm run content        # Markdown -> generated data
npm run typecheck      # TypeScript
npm run lint           # ESLint
npm run format:check   # Prettier
npm run test           # content first (pretest), then Vitest, including the round trip
npm run build          # content + typecheck + production build into dist/
npm run preview        # serve dist/ with the real base path
npm run icons          # PWA icons from the logo geometry (needs Python + PyMuPDF; PNGs are committed)
```

## How it is built

Markdown -> `scripts/build-content` -> JSON per page (formulas pre-rendered with KaTeX) -> lazy chunks -> React renders typed blocks. Stack: Vite, React, TypeScript (strict), Tailwind CSS v4, React Router (`HashRouter`), Vitest, vite-plugin-pwa. Design: `DESIGN-cohere.md`. See `ARCHITECTURE.md`.

## Documents

`PRD.md` (goals), `PLAN.md` (phases and decisions), `ARCHITECTURE.md`, `CONTENT-SCHEMA.md`, `UI-SPEC.md`, `DESIGN-cohere.md` (design standard), `TESTING.md`, `DEPLOY.md`, `AGENTS.md` (rules for AI agents).

## Fonts and licenses

Space Grotesk, Inter, IBM Plex Mono and IBM Plex Sans Thai are SIL Open Font License, self-hosted through `@fontsource`. KaTeX is MIT. The logo is original.
