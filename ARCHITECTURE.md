# ARCHITECTURE

How the repository, the build pipeline and the app are organized. Target state; nothing here is built yet. Rules marked **MUST** are enforced by lint, tests or review.

This project combines the two reference sites in the same course folder tree: the **Home diagram** and **share dialog** of 1322201 Digital Logic Notes, and the **long page with a contents rail** and the **CSS-first animation layer** of 1323404 NLP Notes. Both are read-only references; code is copied and adapted, never imported across repositories.

## 1. Principles

1. **One source of truth.** The three Markdown files declared in `PAGES`. Everything shown to students is generated from them.
2. **Data-driven UI.** Components render typed data. No course text is hard-coded in components.
3. **Feature-first.** Code that changes together lives together. Shared primitives are small and generic.
4. **Static and cheap.** Parsing and KaTeX happen at build time. The browser only renders.
5. **Boundaries are explicit.** Layers import downward only (section 5).
6. **Cheap motion.** CSS first (no animation library), transform and opacity, one shared IntersectionObserver, play once, a reduced-motion variant for everything.

## 2. System overview

```
content/midterm/*.md --(scripts/build-content)--> src/content/generated/{home,meta,<page>}.json + report.txt
                                                             |
                               React app (Vite) <------------+  one lazy chunk per page, home.json for the diagram
                                         |
                                  dist/  (static files + service worker)
                                         |
                                  GitHub Pages  (deployed by GitHub Actions)
```

Build order is always: `content`, then `typecheck`, then `vite build`.

## 3. Target folder structure and reuse

```
ML_Notes/
├─ AGENTS.md  CLAUDE.md  PRD.md  PLAN.md  ARCHITECTURE.md  CONTENT-SCHEMA.md
├─ UI-SPEC.md  TESTING.md  DEPLOY.md  DESIGN-cohere.md  README.md
├─ package.json  package-lock.json  tsconfig*.json  vite.config.ts
├─ eslint.config.js  .prettierrc  .prettierignore  .gitignore  .nvmrc
├─ .github/workflows/        ci.yml, deploy.yml
├─ .claude/skills/           edit-content/, verify-math/, add-component/
├─ content/                  SOURCE OF TRUTH (Markdown only)
│  └─ midterm/               Regression.md, Classification.md, Clustering.md (moved here from Midterm_Summary/ in Phase 1)
├─ docs/                     lecturer slides, notebooks and code (reference only, never read by the build)
├─ scripts/
│  ├─ build-content/         run.ts (CLI), index.ts, parse.ts, html.ts, tree.ts, math.ts, svg.ts, project.ts, report.ts
│  └─ make-icons.py          PWA icons from the logo geometry
├─ public/                   favicon, manifest icons, robots.txt
├─ src/
│  ├─ main.tsx               entry
│  ├─ app/                   App.tsx (HashRouter, routes from PAGES), layout/AppLayout.tsx, pwa/ (ToastHost, versionCheck)
│  ├─ pages/                 HomePage, TopicPage (one component, three routes), NotFoundPage
│  ├─ features/
│  │  ├─ home/               HomeHero, HomeIllustration
│  │  ├─ home-diagram/       HomeDiagram, DiagramNode, DiagramBlocks, model, useDiagramLayout, useLeavingColumns, urlState
│  │  └─ topic/              TopicHero, TopicIllustration (regression, classification, clustering), OverviewPanel,
│  │                         SectionHeader, TopicOutline, useActiveAnchor,
│  │                         rail/ (RailLayout, RailTree, RailDrawer, RailToggle, ProgressRing, treeModel)
│  ├─ components/
│  │  ├─ ui/                 Button, PillLink, Chip, Icon, Skeleton, Prose, Toast, StatRow
│  │  ├─ content/            BlockRenderer, InlineContent, TableBlock, FigureBlock, ScrollArea, SolLabel, AnsStrip,
│  │  │                      ExampleCard (topic pages)
│  │  ├─ layout/             Navbar, MobileMenu, MenuToggleIcon, Logo, ShareButton, ShareDialog, QrCode,
│  │  │                      PageContainer, ReadingProgress, BackToTop
│  │  └─ motion/             CountUp, DrawPath
│  ├─ content/
│  │  ├─ types.ts            Inline, Block, ContentNode, PageFile, HomeFile (shared with scripts)
│  │  ├─ stats.ts            pure counting helpers (also used by the build)
│  │  ├─ loaders.ts          page id -> lazy import of generated/<id>.json; loadHome, loadMeta
│  │  └─ generated/          BUILD OUTPUT, git-ignored
│  ├─ hooks/                 usePageContent, usePageTitle, useMediaQuery, useReducedMotion, useReveal,
│  │                         useScrollProgress, useFocusTrap, useLockBodyScroll, useResizeObserver
│  ├─ lib/                   cn, text, jumpTo, reveal, motion, dragScroll, qr, share, ids
│  ├─ styles/                index.css (Tailwind, @theme tokens, type utilities), fonts.css, motion.css, content.css
│  └─ config/                site.ts (REPO_NAME, SITE_NAME, PAGES, UI_TEXT), pwa.ts
└─ tests/                    fixtures/, content/ (round trip, tree, snapshot), a11y, pwa
```

### Reuse map

| Source | File or folder | Action | Notes |
|---|---|---|---|
| 1322201 | `scripts/build-content/*` | **Adapt** | Read only `PAGES`; new `html.ts` for tables and the `<sup>` heading; tree rules of `CONTENT-SCHEMA.md` section 5; example detection by heading; keep KaTeX strict, SVG checks, round trip, report |
| NLP Notes | `scripts/build-content/{index,run,report}.ts` | **Adapt** | `PAGES`-driven build, page JSON, meta file, warnings count |
| both | `src/components/content/*` | **Copy**, restyle | Add `Cell` header flags, `SolLabel`, `AnsStrip`, step and label paragraphs |
| 1322201 | `src/features/home-diagram/*` | **Adapt** | Tree depth from data (topic, section, sub-topic, overview entries), lazy page chunks per topic, URL state, Cohere styles |
| 1322201 | `src/components/layout/{ShareDialog,QrCode}.tsx`, `src/lib/qr.ts`, `overlay.css` | **Copy**, restyle | Add the Web Share API path (`lib/share.ts`) |
| 1322201 | `src/components/layout/{Navbar,MobileMenu,MenuToggleIcon,Logo}.tsx` | **Adapt** | Three-zone navbar, three tabs, share button, new logo |
| NLP Notes | `src/features/midterm/rail/*`, `useActiveAnchor`, `jumpTo`, `lib/estimate.ts` | **Adapt** into `features/topic` | Levels section, sub-topic, example; `?s=` entry; Cohere styles |
| NLP Notes | `src/components/layout/{ReadingProgress,BackToTop}.tsx`, `components/motion/CountUp`, `lib/reveal.ts`, `hooks/useReveal.ts`, `hooks/useScrollProgress.ts`, `styles/motion.css` | **Copy**, restyle | Coral accents |
| both | `src/app/pwa/*`, `vite-plugin-pwa` config, `scripts/make-icons.py` | **Copy** | New name, base path, colours, logo geometry |
| both | `src/lib/{cn,text,dragScroll}.ts`, `hooks/{useMediaQuery,useFocusTrap,useLockBodyScroll}` | **Copy** | |
| both | tooling: `tsconfig*`, `eslint.config.js` (import rules), `vite.config.ts`, Prettier, `.github/workflows/*` | **Copy**, rename | `REPO_NAME = 'ML_Notes'` |
| both | `src/styles/index.css` | **Rewrite** | Tokens from `DESIGN-cohere.md` |
| none | `features/home` hero, topic cards, the four illustrations, `TopicHero`, `OverviewPanel`, `SectionHeader`, `components/content/ExampleCard` | **New** | |
| both | content, DESIGN files, `dist/`, `node_modules/`, `.git/` | **Do not copy** | |

## 4. Data flow in detail

1. `scripts/build-content` reads the files declared in `PAGES` and the reference page `REFERENCE_PAGE` (`src/config/site.ts`; the reference page gets its own json and meta entry but no place in `home.json`), parses blocks (Markdown plus the allowed HTML), builds each page tree (`CONTENT-SCHEMA.md` section 5), pre-renders every formula with KaTeX (strict, HTML plus MathML), validates tables and SVG, runs the round trip, and writes `generated/<page>.json`, `generated/home.json`, `generated/meta.json` and `report.txt`.
2. `TopicPage` paints the navbar and hero from `meta.json` (small, preloaded), then two frames later (`useAfterPaint`) loads `generated/<page>.json` with a skeleton, then mounts sections and cards in batches.
3. `HomePage` paints the hero and the diagram root from `home.json`; opening a topic in the diagram loads that page's chunk (already prefetched on idle) to show leaf blocks and examples.
4. `BlockRenderer` maps `block.t` to a component; an unknown type fails the type check.
5. Computed values (counts, leaf lists for the topic cards, EX numbers, rail levels) come from the data through pure helpers in `content/stats.ts` and `lib/`, never typed by hand.

The browser never ships a Markdown parser or KaTeX JavaScript. It receives KaTeX HTML plus `katex.min.css` and KaTeX fonts.

## 5. Layering and import rules (MUST)

```
pages  ->  features  ->  components  ->  hooks / lib / content(types, stats) / config
app    ->  pages, components, config
```

- `features/*` MUST NOT import from other `features/*`. Shared pieces move to `components/` or `lib/`.
- `components/ui/*` and `components/motion/*` MUST NOT import from `features/` or `pages/`.
- `scripts/*` MAY import `src/content/types.ts` and `src/content/stats.ts` only. No React code.
- `src/content/generated/*` is imported only by `src/content/loaders.ts`.
- Enforced with ESLint `no-restricted-imports` path patterns (copied from the references).

## 6. State management

- Local component state and `useReducer` only. No global store.
- Diagram state (open node per column, examples open) lives in `features/home-diagram/model.ts` and is mirrored in the hash query (`urlState.ts`), so it can be shared.
- Topic page reading position comes from `useActiveAnchor`, owned by `RailLayout`, passed down as props.
- Nothing about the visitor is stored. No `localStorage`.

## 7. Routing

- `HashRouter` (GitHub Pages cannot rewrite deep links). Routes: `/`, one route per `PAGES` entry, `/definitions` (`REFERENCE_PAGE`), `*`. Each route is code-split with `React.lazy`; `TopicPage` and `DefinitionsPage` are thin wrappers over one `ContentPage` (hero from the meta file, then the rail and outline); they differ only in the hero.
- `?s=<node>` on a topic route: after the content mounts, `jumpTo(node)` runs once. In-page navigation (rail entries) does not change the URL.
- `?p=...&x=1` on Home: the diagram's open path (UI-SPEC 4.2).

## 8. Styling and tokens

- Tailwind v4 CSS-first. All colors, radii, spacing and type utilities are defined once in `src/styles/index.css` under `@theme`, copied from `DESIGN-cohere.md` (the single source, never edited). The default Tailwind palette and radius scale are switched off so only design tokens exist.
- Token names used in code: colors `primary`, `cohere-black`, `ink`, `deep-green`, `dark-navy`, `canvas`, `soft-stone`, `pale-green`, `pale-blue`, `hairline`, `border-light`, `card-border`, `muted`, `slate`, `body-muted`, `action-blue`, `focus-blue`, `coral`, `coral-soft`, `on-primary`, `on-dark`, `error`; radii `xs` 4, `sm` 8, `md` 16, `lg` 22, `xl` 30, `pill` 32, `full`; spacing `xxs` to `section`.
- Addenda the design file does not cover (fonts, responsive type, Thai line height, contrast pairings) live in `UI-SPEC.md` section 1 and 12.
- Components use utility classes that reference tokens. No raw hex in TSX (the illustrations take colours through CSS variables).

## 9. Engines (summary; details in `UI-SPEC.md`)

- **Diagram:** columns in one flex row (normal flow, never absolute blocks), connectors as one SVG layer of cubic curves from measured rectangles (`ResizeObserver`), leaving columns kept mounted for their exit, auto-scroll to the newest column.
- **Topic page:** one flow layout; on `lg` a grid (toggle gutter, rail, content), below it a single column with a floating toggle and a drawer. `useActiveAnchor` (one frame-throttled scroll handler) publishes the active node, per-section progress and page progress. Cards mount in batches with placeholders (`lib/estimate.ts` heights, `content-visibility: auto`), `jumpTo` mounts everything first and corrects its landing after `scrollend`.
- **Motion:** `styles/motion.css` (keyframes, `data-reveal`/`data-shown`, `--ease-spring` as a `linear()` curve), `lib/reveal.ts` (the shared IntersectionObserver), `useScrollProgress`, `DrawPath` for `stroke-dashoffset` drawing, the Web Animations API for measured moves. Illustrations are SVG components with fixed coordinates and CSS animation classes.

## 10. Offline and PWA

- `vite-plugin-pwa` (`generateSW`, `registerType: 'prompt'`) precaches the whole build: HTML, JS, CSS, the generated chunks, KaTeX CSS and fonts, the four font families, icons.
- `ToastHost` applies a new worker by itself (checked every minute and on tab focus), the toast "มีเวอร์ชันใหม่ พร้อมใช้งาน" / "โหลดใหม่" is the backup. `version.json` plus `versionCheck.ts` handle phones that are slow to update the worker. Details in `DEPLOY.md`.

## 11. Naming and conventions

| Thing | Convention |
|---|---|
| Components | `PascalCase.tsx`, named export, default export only for lazy pages |
| Hooks | `useThing.ts` |
| Utilities | `camelCase.ts` |
| Types | `PascalCase`, no `I` prefix |
| Constants | `SCREAMING_SNAKE_CASE` only for true constants |
| Node ids | `<page>/<number>`, `<page>/<number>/ex<K>`, `<node>/overview` (`CONTENT-SCHEMA.md` section 5) |
| Test files | `thing.test.ts(x)` next to the code, plus `tests/` for cross-cutting |
| Commits | Conventional Commits |

## 12. Extension points

| Want to add | Do this |
|---|---|
| More examples or formulas | Edit the Markdown; no code change |
| A new sub-topic | `### N.M Title` under its section; it appears on Home and in the rail |
| A final-exam set of pages | A new folder `content/final/`, entries in `PAGES` with a `group`, a second root in the diagram. Ask first |
| A new Markdown or HTML construct | Extend `parse.ts`/`html.ts` and `types.ts`, add a block component and tests, document in `CONTENT-SCHEMA.md` |
| A new design token | Ask the user; `DESIGN-cohere.md` stays unmodified, record it as an addendum in `UI-SPEC.md` |
