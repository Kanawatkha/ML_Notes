# AGENTS.md

Instructions for any AI coding agent working in this repository. Humans can read it too.

## Overview

ML Notes is a static, frontend-only study site for the midterm of course 1322308 Machine Learning (PIM). It has four pages: Home (an interactive diagram of the exam scope), Regression, Classification and Clustering. Content lives in three Markdown files under `content/midterm/`. A Node build script turns them into typed data. A React app renders the data and ships as a PWA on GitHub Pages.

It reuses code from two sibling projects in the same course folder tree, read-only references: 1322201 Digital Logic Notes (`../../1322201 การออกแบบดิจิทัลลอจิก/midterm/`: home diagram, share dialog, pipeline) and 1323404 NLP Notes (`../../1323404 การประมวลผลภาษาธรรมชาติ/NLP_Notes/`: contents rail, CSS animation layer, PAGES-driven build). Copy and adapt as `ARCHITECTURE.md` section 3 says; never edit those folders.

## Tech stack (pin exact versions in `package.json` at scaffold time, same majors as the references)

- Node.js 24 (`.nvmrc`), npm with a committed `package-lock.json`
- Vite, React, TypeScript (strict), React Router (`HashRouter`)
- Tailwind CSS v4 with tokens in a CSS `@theme` block derived from `DESIGN-cohere.md`
- No animation library: CSS keyframes and transitions (springs as `linear()` curves) and the Web Animations API
- KaTeX at build time only. The browser receives pre-rendered HTML plus KaTeX CSS and fonts
- Vitest + Testing Library, axe-core, ESLint + Prettier
- `vite-plugin-pwa` and `workbox-window` for offline support
- Self-hosted open fonts via `@fontsource` (Space Grotesk, Inter, IBM Plex Mono, IBM Plex Sans Thai; all SIL OFL)
- No backend, database, analytics or external API

## Commands (created in Phase 1)

```
npm ci                 # install exactly from the lockfile
npm run content        # Markdown -> generated data (scripts/build-content)
npm run dev            # content + Vite dev server
npm run typecheck      # tsc --noEmit
npm run lint           # ESLint
npm run format:check   # Prettier
npm run test           # content first (pretest), then Vitest (includes content round trip)
npm run build          # content + typecheck + Vite build into dist/
npm run preview        # serve dist/ with the real base path
npm run icons          # PWA icons from the logo geometry (needs Python + PyMuPDF)
```

Before reporting any task as done: `typecheck`, `lint`, `test` and `build` must pass.

## Repository layout (target, see ARCHITECTURE.md)

```
content/midterm/    Markdown source of truth (Regression.md, Classification.md, Clustering.md)
docs/               lecturer slides, notebooks, code (reference only, never built)
scripts/            build-content pipeline (Node, TypeScript), make-icons.py
src/                React app (app, pages, features, components, content, hooks, lib, styles, config)
public/             static files (icons, manifest assets)
tests/              cross-cutting tests and fixtures
.github/workflows/  CI and Pages deploy
.claude/skills/     agent skills
```

## Code style

- TypeScript strict. No `any`; use `unknown` and narrow. `type` for data shapes; `interface` for props only when extending.
- Function components and hooks only. One component per file, file name equals component name. Hooks `useX.ts`. Utilities `camelCase.ts`.
- Feature-first folders (`src/features/<feature>/`). Shared primitives in `src/components/`.
- Import with the `@/` alias. No deep relative imports across features.
- Tailwind utilities that reference design tokens. No inline hex or pixel literals that duplicate a token.
- Keep components small and presentational. Data shaping goes to `lib/`, `content/stats.ts` or the pipeline.
- No dead code, no commented-out code, no `console.log` in committed code.
- Accessibility is part of done: semantic elements, labels, focus order, `aria-expanded` on disclosure controls, visible focus ring, `prefers-reduced-motion` respected.

## Content rules

- Edit content only in `content/midterm/*.md`. Never edit generated files (`src/content/generated/**`, git-ignored, rebuilt by `npm run content`).
- Follow `CONTENT-SCHEMA.md` for the shapes the pipeline understands. Load the `edit-content` skill before editing content and the `verify-math` skill before changing any number.
- Content is Thai with English technical terms, written in a concise hand-written exam style: "จากสูตร", substitution, "ดังนั้น", `**Ans**`. No meta text about sources (no "ตามอาจารย์", "ตามสไลด์", notes about the lecturer's board).
- Do not renumber sections or sub-topics without checking shared `?s=` links.
- Never read or render `docs/` from the build.

## Testing

- `tests/` and `*.test.ts(x)` next to code. Required checks in `TESTING.md`: round trip, KaTeX strict, SVG and table rules, counts snapshot, accessibility, size budget.
- A bug fix includes a regression test when practical.

## Git and PR rules

- Small, focused commits. Conventional Commits (`feat:`, `fix:`, `docs:`, `content:`, `chore:`, `test:`, `refactor:`).
- Never commit `node_modules/`, `dist/`, generated data, or font files whose license forbids redistribution.
- **Do not run any git command that changes the repository (add, commit, push, mv, rm, branch) unless the user asks in that message.**

## Security and licensing

- No secrets in the repo. There is nothing to authenticate against.
- Fonts are SIL OFL and self-hosted, so they may be bundled in the public build.
- `DESIGN-cohere.md` is an analysis of another company's design language. Use its tokens only. Do not copy the company's name, logo, copy, photography or illustrations.
- Ask before adding a dependency not listed above. Prefer MIT/Apache/BSD packages.

## Boundaries for agents

- Always: verify numbers programmatically, keep changes within the current phase of `PLAN.md`, update the relevant doc when behavior changes.
- Ask first: new dependencies, moving or deleting content or `docs/`, changing design tokens or `DESIGN-cohere.md`, changing the Markdown-to-data rules, adding a page, anything that needs a paid or external service.
- Never: edit generated data by hand, hard-code course text in components, add Cohere, Anthropic or Claude branding, edit the reference projects, push without being asked.
