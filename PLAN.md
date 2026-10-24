# PLAN: Delivery plan

Phases run in order. Each phase ends with exit criteria and a **gate**: the user reviews and says "go" before the next phase starts. Update checkboxes as work completes.

Legend: `[ ]` todo, `[x]` done. "Ask" means stop and ask the user first.

## Decisions

Decided by the user:

| # | Decision |
|---|---|
| D1 | Site name **ML Notes**, four pages: Home, Regression, Classification, Clustering (one page per Markdown file) |
| D2 | Home shows the exam scope (three big topics and their sub-topics) as an interactive diagram, like the Home of 1322201 Digital Logic Notes |
| D3 | `DESIGN-cohere.md` is the design standard, used as-is and never edited |
| D4 | A share button; no footer |
| D5 | Design, layout, animation and polish should match or improve on the two reference projects (1322201 and 1323404) and suit this course |
| D6 | Git: only when the user says so in that message. The repository is `ML_Notes` (`origin` = `https://github.com/Kanawatkha/ML_Notes.git`) |

Decided by the agent (the user said to choose; revisit at any gate):

| # | Decision | Alternative |
|---|---|---|
| D7 | Topic pages use the NLP Notes layout: hero band, contents rail (icon toggle, foldable, drawer on phones), section headers, example cards with Sol and Ans always shown | Plain prose pages without a rail (1322201 chapter pages) |
| D8 | Home = split hero (text plus an animated illustration card), the diagram on a soft-stone canvas, then three topic cards (Cohere `product-card`) | Diagram only, as in 1322201 |
| D9 | Thai font: IBM Plex Sans Thai (400/500/600); Latin display Space Grotesk, body Inter, mono IBM Plex Mono (the design's documented fallbacks plus a real mono) | Anuphan for Thai headings, or Noto Sans Thai |
| D10 | Topic colours from the design's dark bands: Regression `dark-navy`, Classification `deep-green`, Clustering `primary`; coral is the one warm accent | One band colour for all pages |
| D11 | Animation is CSS first with the Web Animations API, no animation library (as NLP Notes); plus three topic illustrations and one Home illustration drawn as thin-line SVG | Motion library (1322201) |
| D12 | Content files move from `Midterm_Summary/` to `content/midterm/` by a plain move (git picks up the rename on commit), names unchanged. The build reads only the files declared in `PAGES` | Keep `Midterm_Summary/` and point `PAGES` at it |
| D13 | The pipeline adapts to the current Markdown (HTML tables, `Sol<sup>n</sup>` headings, `**Ans**` paragraphs); the content is not rewritten for the site | Rewrite the Markdown into the reference projects' shapes |
| D14 | PWA offline: yes (prompt toast plus version check, as both references) | Skip |
| D15 | Tests: Vitest (pipeline, round trip, components), axe in the tests and in a real browser, Lighthouse by hand, no Playwright e2e | Add Playwright smoke |
| D16 | Home diagram state is mirrored in the URL hash query so a diagram state can be shared | No URL state |
| D17 | Share: Web Share API on touch devices, QR and copy-link dialog otherwise (1322201's own QR encoder) | Dialog everywhere |
| D18 | Solutions are always shown (no hide switch in the first release) | A "แสดงเฉลย" switch for self-testing (see Future) |
| D19 | `CLAUDE.md` is git-ignored, as in both references (agents read it locally; `AGENTS.md` is committed) | Commit it |

Open for the user (do not act without an answer):

| # | Question | Default if not answered |
|---|---|---|
| O1 | `docs/` (lecturer slides, notebooks, Python files) is already public in the repo. Keep it there? | Decided by the owner: keep it public; it is never read by the build |

## Phase 0 - Planning documents  (done, 2026-10-23)

- [x] Read the plan documents and skills of both reference projects and `DESIGN-cohere.md`; scanned the three Markdown files (headings, HTML tags, tables, figures, formulas)
- [x] Wrote `CLAUDE.md`, `AGENTS.md`, `README.md`, `PRD.md`, `PLAN.md`, `ARCHITECTURE.md`, `CONTENT-SCHEMA.md`, `UI-SPEC.md`, `TESTING.md`, `DEPLOY.md`, `.claude/skills/*`
- [x] Tech stack reviewed with the user and kept as planned (no Astro, Playwright, Preact, search or stored reading progress)
- [x] User approved the plan documents. Open item O1 (`docs/` stays public?) was answered later: it stays public
- Next: Phase 1, started only when the user says go

## Phase 1 - Restructure and scaffold  (done, awaiting review)

Goal: a clean repo that builds an empty app and can deploy it.

- [x] `Midterm_Summary/` moved to `content/midterm/` by a plain move (D12); git was not touched, so the rename appears as delete plus add until the user commits (git detects it by similarity); references in the docs updated
- [x] `.gitignore`: `node_modules`, `dist`, `*.tsbuildinfo`, `src/content/generated`, `CLAUDE.md` (D19), tool output; `.nvmrc` 24, `.prettierrc`, `.prettierignore` (ignores `*.md`, `content`, `docs`)
- [x] Tooling copied from the NLP Notes project and trimmed: `tsconfig.json`, `tsconfig.node.json`, `eslint.config.js` (architecture import rules), `vite.config.ts` (React, Tailwind v4, `@` alias, Vitest, `base` `/ML_Notes/` for build and preview), `package.json` (`ml-notes`, same version ranges as the references; installed: react, react-dom, react-router-dom and the dev tooling; KaTeX, fonts, PWA packages and axe come in the phases that need them)
- [x] `src/config/site.ts` (`REPO_NAME`, `SITE_NAME`, `PAGES` with band and kind, `UI_TEXT`), `HashRouter` with Home, one `TopicPage` component for three routes, `NotFoundPage`, a plain navbar stub (the real one is Phase 3), skip link, focus moved to `<main>` after navigation, page titles (`<page> | ML Notes`)
- [x] `npm run content` is a stub that checks every `PAGES` source exists; the other scripts of `AGENTS.md` work (`icons` comes with the PWA phase)
- [x] `.github/workflows/ci.yml` (lint, format check, typecheck, test, build) and `deploy.yml` (as the references); favicon from the logo geometry
- [x] Checks: `typecheck`, `lint`, `format:check`, `test` (9 tests) and `build` are green; production preview at `/ML_Notes/`: each of the four routes shows its heading and title, an unknown hash shows the not-found page, no console errors, no horizontal scroll
- [ ] User: commit and push when asked, then Settings, Pages, Source "GitHub Actions"
- Exit: `npm run build` green locally (done) and in CI; the empty site live at the Pages URL (needs the push)
- Gate

## Phase 2 - Content pipeline  (done, awaiting review)

Goal: the three Markdown files to typed, tested data.

- [x] `scripts/build-content` adapted from the references: `parse.ts` (blocks and inline, `<sup>` and `<b>`, `&nbsp;`, HTML tables through `html.ts`, figures through `svg.ts`), `tree.ts` (page, sections, sub-topics, examples by heading with a `Sol<sup>n</sup>` child, Ans split, step and label flags), `math.ts` (KaTeX strict, HTML plus MathML), `project.ts` (round trip), `report.ts`, `index.ts`, `run.ts`
- [x] `src/content/types.ts`, `stats.ts` (counts and the Home outline), `loaders.ts` (`loadPage`, `loadHome`, `loadMeta`); output in `src/content/generated/`: `<page>.json`, `home.json`, `meta.json`, `report.txt` (git-ignored)
- [x] Build checks: unknown tags, attributes and constructs, table shape, SVG rules (viewBox, aria-label, currentColor and none only, no blank line, well formed, ids made unique per figure), KaTeX strict, heading levels, one Sol per example, sub-topic numbers, unique ids, round trip (text, formulas, figures, heading numbers)
- [x] Result: 3 pages convert with 0 errors and 0 warnings. Regression 3 sections, 4 examples, 9 tables; Classification 4 sections, 4 sub-topics, 12 examples, 28 tables, 6 figures; Clustering 1 section, 2 examples, 8 tables, 1 figure. Totals: 11 leaves, 18 examples, 45 tables, 7 figures. Report: `src/content/generated/report.txt`
- [x] Sizes (gzip): Regression 34 KB, Classification 61 KB, Clustering 14 KB (budget 150 KB each)
- [x] Tests (61 in total): parser and tree on fixtures (structure, ids, flags, tables, figures, 40 error cases), the real content (counts snapshot, ids, Sol and Ans in every example, rectangular tables, unique figure ids, size budget, derived stats), round trip with mutation checks, the build reads only declared files
- [x] `typecheck`, `lint`, `format:check`, `test`, `build` green
- [x] One change to the Markdown, needed by KaTeX strict mode: the circled digits in the K-NN and K-NN regression vote lines (`①` and so on, 42 in all) are now `\text{\textcircled{N}}`. They render the same in the VS Code preview (KaTeX) and compile in the build
- [ ] User reviews `src/content/generated/report.txt` (tree, ids, counts) and checks that the vote lines still look right in the Markdown preview
- Gate

## Phase 3 - Design system and app shell  (done, awaiting review)

- [x] `@theme` tokens copied from `DESIGN-cohere.md` (23 colors, 7 radii, section spacing), the default Tailwind palette and radii switched off; `tests/design-tokens.test.ts` compares the CSS with the design file (colors, radii, spacing, font stacks, topic bands), checks the type scale and the contrast pairings of `UI-SPEC.md` section 12
- [x] Type utilities `type-hero`, `type-product`, `type-section-display`, `type-section-heading`, `type-card-heading`, `type-feature-heading`, `type-body-lg`, `type-body`, `type-button`, `type-caption`, `type-mono`, `type-micro`, `tabular` with the responsive steps (425, 768, 1024) and the Thai rules (display tokens for Latin-only text, line height 1.25 or more elsewhere, uppercase only in the mono label)
- [x] Fonts self-hosted as woff2, only used files: Space Grotesk 400/500, Inter variable, IBM Plex Mono 400/500 (Latin), IBM Plex Sans Thai 400/500/600 (Thai). Changed from the plan: Thai headings use weight 400, not 500, because 500 looked bold beside the Latin face in the browser check (UI-SPEC Addendum A updated)
- [x] Logo (three points on a fitted line, last point coral) and `public/favicon.svg`
- [x] Navbar in three zones (logo, three tabs with topic dots and an outlined active tab, share button; hamburger below 768), hairline that fades in on scroll; mobile menu (panel under the navbar, rows with number, swatch, title, chevron, focus trap, Esc, scroll lock, closes on navigation); `MenuToggleIcon`; skip link, focus moved to `<main>` after navigation, page titles, 404 page
- [x] Share: `lib/share.ts` (Web Share API on touch devices, `canNativeShare`, `nativeShare`), `ShareDialog` with QR code and copy-link field, own QR encoder copied from 1322201 (`lib/qr.ts` with its tests; the structural checks and the snapshot of the real-reader-decoded matrix still pass). The QR code of three real addresses of this site was decoded back with OpenCV: all match
- [x] UI primitives: Button (primary, secondary, outline), `buttonClass`, Chip, StatRow, Icon, Skeleton, Toast, Prose, PageContainer, Logo
- [x] Temporary `features/home/DesignPreview.tsx` on Home (colors, type scale, buttons, chips, topic bands, a product card, an example card with Sol label and Ans strip, a table, skeleton and toast with sample text); it is replaced by the real Home in Phase 6
- [x] Tests (100 in total): design tokens and contrast, share logic, navbar tabs, menu (focus trap, Esc, route change, scroll lock), share dialog (address, QR, focus return, copy), primitives, topic colours; `typecheck`, `lint`, `format:check`, `test`, `build` green
- [x] Checked in the browser (production preview): desktop 1280 and phone 390 widths render the preview with no overflow; Thai tone marks are clean at every heading size; menu and share dialog open with focus inside, Esc closes and returns focus, scroll lock is set and released
- [ ] User reviews the look at desktop, tablet and phone sizes, and the Thai font on a real phone
- Gate

## Phase 4 - Topic pages  (done, awaiting review)

- [x] Block renderer (`components/content`): paragraph with label and step looks, display math in a scroll area, lists with nested blocks, HTML tables (head rows, row headers, empty cells, per-cell alignment, a readable name for a header cell that holds only a formula), figures named by the aria-label of the SVG, notes, inline text, bold, superscript, code and pre-rendered math; `ScrollArea` (keyboard stop and named region only while it overflows), KaTeX CSS (woff2 only through a small Vite plugin) and `content.css`; right-button drag scrolling (`dragScroll`) installed in `App`
- [x] `ExampleCard` (EX chip, title, problem, Sol label, steps, Ans strip), heading level 3 under a section and 4 under a sub-topic
- [x] Topic page: `TopicHero` (coloured band, mono tag `SUPERVISED · 02 / 03`, title, lead from the Markdown, counts from the data; the illustration slot is empty until Phase 7), `Overview` panel (Regression's shared formulas), section and sub-topic headings with their theory, one card per example; hero painted from `meta.json` first, the page chunk loaded two frames after
- [x] Staged mounting: the page is a flat list of units (overview, section or sub-topic theory, one example each); the first 4 mount at once, the rest when their placeholder (same id, estimated height) comes within 1200 px of the window, and the remainder 3 at a time in idle moments from 3 s on; without IntersectionObserver everything mounts at once
- [x] `?s=` entry: `#/classification?s=1.3/ex2` and `?s=overview` mount every unit, then `jumpTo` scrolls to the node and focuses it (landing correction included, copied from NLP Notes; the rail and drawer are Phase 5)
- [x] Content loading with skeleton, error and retry (`LoadError`), `usePageMeta`, `usePageContent`, `useAfterPaint`
- [x] Tests (157 in total): every block type and table case, the example card order, the units list of Classification, every page rendered in full (section and sub-topic ids, example articles, tables, figures, formulas equal to the counts of the data, heading order without skipped levels, an Ans strip in every card), staged mounting with a fake IntersectionObserver (placeholders keep ids, near placeholders mount, `mountAll`), the page (hero from meta, content, `?s=`, error and retry), text and estimate helpers; `typecheck`, `lint`, `format:check`, `test`, `build` green
- [x] Checked in the browser (production preview): the three pages render 4 + 12 + 2 example cards with 9 + 28 + 8 tables, 0 + 6 + 1 figures and 181 + 322 + 59 formulas (equal to the data); no skipped heading levels; no horizontal page scroll at 1280; at 800 px width the example card, table, K-NN formulas and the FFBP matrices (with their size subscripts and thin scrollbars where wide) read correctly; the link with `?s=` mounts everything and focuses the target (the smooth scroll itself does not advance in the hidden preview pane; its call is covered by tests)
- [ ] User compares each page with the Markdown preview in VS Code (formulas, tables, figures, the order of sections and examples)
- Gate

## Phase 5 - Navigation: rail, drawer, jump  (done, awaiting review)

- [x] Contents tree (`features/topic/rail/treeModel.ts`): the overview (when the page has one), each section with its examples and sub-topics, each sub-topic with its examples; entry ids are the ids of the elements on the page, and the flat order equals the order of the parts of the page (tested)
- [x] `RailToggle`: icon only (a list icon that turns into a cross), accessible name that follows the state, `aria-expanded`, `aria-controls`, no visible text
- [x] Desktop (1024 px and up): grid `48 px toggle gutter | 264 px rail | body`, sticky foldable rail (the column width animates, 380 ms; the folded rail is `inert` and `aria-hidden`), open by default; one layout is rendered at a time (`useMediaQuery`)
- [x] Phone and tablet: a 48 px floating round button at the bottom left and a modal drawer from the left over a blurred scrim (focus trap, Esc, scrim press, scroll lock released as soon as it starts to close, a choice closes it and jumps 50 ms later)
- [x] `RailTree`: section number in mono, a progress ring on every section (clockwise fill, a green disc with a check when finished), `EX 03` tags on examples, the section and the sub-topic being read are expanded (the rest `inert`), one sliding highlight with an ink bar, `aria-current="location"`
- [x] `useActiveAnchor`: one frame-throttled scroll handler gives the deepest entry reached, the progress of each section (from its top to the next section, the last to the end of the body) and the bottom-of-page case; a click sets the position at once and pauses the spy until `scrollend` (or 1 s)
- [x] `jumpTo` (with landing correction) from the contents, after `beforeJump` mounts every part with `flushSync`; `?s=` entry from Phase 4 kept
- [x] `ReadingProgress` (2 px coral line under the navbar, topic pages only) and `BackToTop` (round button bottom right after the first screen, a coral ring that fills with the page progress, out of the tab order while hidden); icon `arrow-up`
- [x] Tests (190 in total, 33 new): tree model, scroll spy, toggle, tree (expansion, `aria-current`, numbers, rings), layout wide and narrow (landmark, fold, columns, jump order, drawer focus, Esc, scrim, choose and jump), progress line and back-to-top, and the page (a choice in the drawer mounts every part before the jump); `typecheck`, `lint`, `format:check`, `test`, `build` green
- [x] Checked in the browser (production preview): at 1100 px the rail (248 px) sits left of the body with the toggle, the current section is highlighted and its sub-topics are open; pressing ID3 mounts all 12 examples, moves the highlight, opens ID3's three examples and focuses the target; at 390 px there is no rail, the floating button (16 px from the edges) opens the drawer with focus inside and the page locked, the toggle stays above the drawer and the back-to-top button with its ring is visible; no horizontal scroll
- Changed from the plan: the drawer panel had no spring overshoot yet; the spring and the staggered entries were added in Phase 7
- [ ] User checks navigation on desktop and phone (the smooth scroll itself does not advance in the hidden preview pane; its call is covered by tests)
- Gate

## Phase 6 - Home  (done, awaiting review)

- [x] `HomeHero` (mono course label, "ML Notes" in the display face, the lead, three numbers from `home.json`: 3 topics, 11 sub-topics, 18 examples) and `TopicCards` (a product card per topic: swatch and tag, Latin title, a rule, a check row per section with the sub-topics of K-NN under it, a pill link to the page); the temporary design preview is removed. The hero illustration card is Phase 7
- [x] Home diagram adapted from 1322201 (`features/home-diagram`): topics in column 1 (swatch, tag, Latin title, count), the sections of the open topic in column 2 (a "ภาพรวม" entry first when the page has one), the sub-topics of a group in column 3 (K-NN gets an overview entry for its own explanation), then the block (breadcrumb, title, explanation and formulas, "ดูตัวอย่าง (N)" and "อ่านในหน้าเนื้อหา") and the example column of shared example cards; one open node per column, connectors in ink with a coral dot at the open child, auto-scroll to the newest column, leaving columns kept for their exit, keyboard (arrows, Esc with focus return), live region, loading and error columns with retry; page chunks are loaded when a topic is opened
- [x] State in the URL (D16): `#/?p=classification:1,1.2&x=1` restores the whole diagram, and every change updates the address with `replace`
- [x] Tests (240 in total, 50 new): diagram model and columns (topics and counts, overview entries, leaves, toggles, Esc, breadcrumb, unknown ids), URL state round trip, the diagram component (open and close, the walk to a leaf and its examples, replace not stack, restore from the address, Esc and arrow keys, announcements, error and retry), every leaf of all three topics opens its block with the right example count and link (13 leaves incl. 2 overview entries), the Home page (h1, numbers from the data, cards and links, rows)
- [x] Checked in the browser (production preview): at 1000 px the hero, the closed diagram with its hint, the open path Classification, K-NN, Cosine with the coral-dotted connectors and the example column restored from the address, and the three cards; at 390 px the diagram scrolls inside its panel to the newest column with no page overflow
- [ ] User reviews the diagram on desktop and phone
- Gate

## Phase 7 - Animation, illustrations and polish  (done, awaiting review)

- [x] Motion layer: `styles/motion.css` (ease tokens with the `linear()` spring and its cubic-bezier fallback, reveal rules, section-header, hero, drawer, menu, QR, toast and jump-arrival keyframes), `lib/reveal.ts` (one shared IntersectionObserver, 10% bottom margin, stagger 40 ms for blocks that arrive together, final state at once for blocks above the window, under reduced motion and without an observer), `useReveal` (variants `rise`, `fade`, `parts`), `components/motion/CountUp` (900 ms count, the real number in the page throughout), `useScrollProgress` from Phase 5; no `DrawPath` component (the drawings use CSS classes instead)
- [x] A1 hero title and lead (title from 30% opacity), A2 counts in `StatRow`, A7 plus turns into minus (`PlusMinusIcon`), A8 section header (rule grows, number and title fade up), A9 example cards (topic pages only, not inside the Home diagram), topic cards and overview panel rise, A15 menu rows rise 30 ms apart, A16 drawer spring with the list rising after 120 ms, A17 share card spring and QR fade, A20 toast. A5, A6, A10 to A14, A18, A19 were built with their features in Phases 5 and 6
- [x] Illustrations (`components/illustrations`): `IllustrationFrame` (card, 400 x 300 drawing, decorative, plays once when scrolled into view), `HomeIllustration` (A3: points, fitted line that goes, two groups with a dashed boundary, two centroids glide to the group means), `RegressionIllustration` (points, line draws while tilting from flat, residual ticks), `ClassificationIllustration` (two classes, query ring, circle grows to the 3 nearest points, query takes the majority colour), `ClusteringIllustration` (grey points, two centroids, colours by nearest centroid, centroids move to the means twice, points that change cluster recolour). Coordinates in `data.ts` came from a script and `data.test.ts` recomputes least squares, k nearest neighbours and k-means from them
- [x] Reduced motion: the global rule also zeroes animation delays; illustrations drop their animations entirely, so the base style of every shape is its final frame; reveals show at once
- [x] Fixes found by axe in a real browser: the logo link name did not contain its visible text ("MLNotes" without a space); the Home diagram section and the diagram region had the same landmark name
- [x] Tests (285 in total, 45 new): illustration data recomputed, illustration markup and play-once behaviour, entrance markup (A1, A7, A8, A9), CountUp and reveal (copied from the NLP project), and axe-core in Vitest on both Home states, all three topic pages, the drawer, the menu, the share dialog and the not-found page (0 serious or critical; contrast is checked in the browser)
- [x] axe in the real browser (production preview, contrast included): 0 violations at any level on Home closed and open (diagram down to the examples), all three topic pages with every part mounted, the drawer, the mobile menu and the share dialog
- [x] Measured (production preview): no horizontal scroll on Home and all three topics at 360, 390, 768, 1024, 1440 and 844 x 390; LCP 0.4 s (the title) and CLS 0.0006 on Home, CLS 0.045 on a topic page (the hero replaces its skeleton); app shell 90.7 KB JS + 16.4 KB CSS gzip (budget 150), largest page chunk Classification 67 KB gzip (budget 150)
- Changed from the plan: the hero illustration card keeps a 4:3 drawing on phones too, limited to 45% of the viewport height, instead of switching to 16:10; the diagram hint disappears at once when the diagram opens instead of fading out (it sits in the flex row, so keeping it would shift the columns)
- [ ] User checks the animation feel on desktop and on a real phone
- Gate

## Phase 8 - Offline (PWA)  (done, awaiting review)

- [x] `vite-plugin-pwa` 2 and `workbox-window` (both in the approved stack of `AGENTS.md`), `generateSW`, `registerType: 'prompt'`, precache of html, js, css, woff2, svg, png and the manifest (56 entries, 3.3 MiB; the three page chunks, KaTeX and the four font families included; `version.json` excluded), navigation fallback `index.html`, `cleanupOutdatedCaches`
- [x] `src/app/pwa/ToastHost.tsx` (bottom-left live region: "ใช้งานออฟไลน์ได้แล้ว" with "ปิด", "มีเวอร์ชันใหม่ พร้อมใช้งาน" with "โหลดใหม่"; a new worker is applied by itself, checked every minute and on tab focus) mounted in `AppLayout`; new button variant `on-dark` (white pill) for the action inside the dark toast
- [x] `src/app/pwa/versionCheck.ts` and the build-time `version.json` (page build id against the server's, on open, on return, when the network comes back and every minute; a mismatch drops the worker and all caches and reloads, at most 3 times in 5 minutes)
- [x] `src/config/pwa.ts` manifest (name "ML Notes", `lang: th`, standalone, theme `canvas` #ffffff, background `soft-stone` #eeece7, icons 192, 512, maskable 512), `apple-touch-icon` link in `index.html`; icons drawn from the logo geometry by `scripts/make-icons.py` (`npm run icons`, PyMuPDF), PNGs in `public/icons`
- [x] Tests (306 in total, 21 new): manifest (names, colours against `DESIGN-cohere.md`, icon files and their pixel sizes, page links), service worker settings (prompt, precache globs, `version.json` not cached, size limit), toast host (live region, both toasts, automatic update plus backup button, dark surface, position), version check (cache-free request, same id, newer id clears worker and caches, loop guard, offline, timers and events); `typecheck`, `lint`, `format:check`, `test`, `build` green
- [x] Checked in the desktop preview pane (production preview): the worker registered and activated, the precache holds the build, the toast "ใช้งานออฟไลน์ได้แล้ว" appeared; with the preview server stopped (no network) a reload still rendered Classification (12 examples, 322 formulas, fonts), Regression, Clustering, Home and the open diagram with its example column. Shell size grew from 90.7 to 92 KB gzip JS (workbox-window and the host); CSS 16.5 KB
- [ ] User: offline test in a real browser and on a phone (`TESTING.md` section 6; add to the home screen, airplane mode)
- Gate

## Phase 9 - Launch  (done)

- [x] Lighthouse mobile on the production preview (`TESTING.md` section 7): Performance 93 to 95, Accessibility, Best Practices and SEO 100 on all four pages, CLS 0 to 0.01, TBT 20 to 180 ms, LCP 2.7 s (0.2 s over the budget under the slow-4G simulation). Fixes: first-paint fonts and route chunks preloaded, nothing under the topic hero until it arrives (CLS 0.149 to 0), 2 parts mounted at first instead of 4 (TBT 340 to 70 ms on Regression)
- [x] Fresh-checkout check: with `src/content/generated/` absent, `lint`, `format:check` and `typecheck` pass, and `npm run test` failed because the tests read generated data. Fixed with `"pretest": "npm run content"`; the whole suite then passes from a clean state (also with the Vitest module cache removed, which had kept an old empty-glob transform of `loaders.ts` locally). The two workflows match `DEPLOY.md` and need no change
- [x] README and `AGENTS.md` checked against the project (commands, status, icons command, pretest)
- [x] Final run: `typecheck`, `lint`, `format:check`, 306 tests and `build` green; app shell 91.9 KB JS + 16.5 KB CSS gzip, largest page chunk 67 KB gzip
- [x] First push to `main` (c25bcfa): the build job passed on CI (lint, 306 tests, build); the deploy job failed with 404 because Pages was not enabled yet. The owner then set Pages, Source: GitHub Actions; the second push (e702418) deployed
- [x] The live site https://kanawatkha.github.io/ML_Notes/ checked after the deploy: Home with its numbers and illustration, the three topic pages with their formulas and examples, manifest, `version.json` and the service worker
- [ ] Owner: offline check on a phone (`TESTING.md` section 6)
- [x] Tag `v1.0.0` on e702418, pushed on the owner's order
- [x] Pages URL ready to share: https://kanawatkha.github.io/ML_Notes/

## After launch: examples and exercises (v1.2)

- [x] Every worked example in `docs/` (notebooks, slides, code) was counted against the notes and every number of the notes was recomputed by independent programs (Regression 4, K-NN 6, Perceptron 2, FFBP 1, ID3 3, K-Means 2 all correct; one misplaced centroid in a K-Means figure and one loose wording about the square root fixed)
- [x] Added the lecturer's examples that were missing: FFBP with all weights 0, the parameter count 2-2-3-4-5-1, K-NN data B for Euclidean and Manhattan, the five tree-and-table structure examples, the two Boolean A/B gain comparisons, the four-row shape data and the A B C D class work. Not added (beyond the midterm scope): continuous attributes, gain ratio, Fuzzy C-Means, Mahalanobis. The Regression notebook has no numeric example (its data are random), so the four Regression examples stay as they were
- [x] New content kind **exercise** (`แบบฝึกหัด N`, problem only): pipeline, data model, ExerciseCard, rail entries `PR nn`, hero counts; 27 exercises (Regression 6, K-NN 8, Perceptron 3, FFBP 3, ID3 4, K-Means 3), each checked by program for a unique answer, no accidental ties and stable rounding
- Counts now: 28 examples and 27 exercises; `classification.json` is 2.0 MB raw and 94 KB gzip (budget 150), Lighthouse mobile performance 92 to 93 on the topic pages

## After launch: solutions and the Definitions page (v1.3)

- [x] Every exercise has its solution (Sol and Ans, same shape as an example), checked by independent programs; each exercise card has its own show/hide button (the solution is not in the page until opened)
- [x] The page-chunk budget moved from 150 to 200 KB gzip because of the solutions (Classification 156 KB)
- [x] New page **Definitions** (`#/definitions`, `content/midterm/Definitions.md`): part 1 the definitions of every topic in the lecturer's wording (overview of Supervised and Unsupervised, Regression, Classification and K-NN, Perceptron, FFBP, ID3, Clustering), part 2 thirteen comparison tables. Sources: the slides and the handwritten notes in `docs/`; the text was fact-checked by an independent reader against them
- [x] Wiring: `REFERENCE_PAGE` in `site.ts` (apart from `PAGES`, so the diagram, the Home counts and the topic colours are untouched), `buildContent(root, PAGES, [REFERENCE_PAGE])`, one shared `ContentPage` for the topic pages and the definitions page, a light `DefinitionsHero`, a fourth navbar tab and menu row, a link on Home

## Future (not planned)

- A final-exam group of pages (`content/final/`, a second diagram root).
- Search across formulas.

## Working agreements

- One phase at a time. Report progress after each checklist group.
- If a decision is missing, ask. Do not guess on scope, dependencies, content changes, or anything that costs money.
- Keep the docs current. If behavior changes, update the matching document in the same change.
- Do not commit or push unless the user asks in that message.
- Estimated effort is not tracked. The order matters more than dates.
