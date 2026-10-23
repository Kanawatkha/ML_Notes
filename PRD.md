# PRD: ML Notes

Product requirements for the study website. Status: agreed in discussion, not yet built. Decisions (made by the user or delegated to the agent) are listed in `PLAN.md` "Decisions".

## 1. Purpose

Give one student a fast, calm and beautiful place to review the hand-calculation questions of the 1322308 Machine Learning midterm: every formula of the exam scope, and every worked example with its full solution, readable on a phone before the exam and easy to share with classmates.

The exam scope (from the lecturer's notebook) has three big topics:

| Topic | Sub-topics |
|---|---|
| Regression | Linear, Nonlinear (Polynomial), K-NN Regression |
| Classification | K-NN (Euclidean, Cosine, Squared Euclidean, Manhattan), Perceptron (vector form), FFBP (matrix form), ID3 (data structure, Entropy and Information Gain) |
| Clustering | K-Means |

## 2. Users and context

- **Primary user:** the author, a Thai student, studying on phone (portrait and landscape), tablet and laptop, often with poor connectivity before an exam.
- **Secondary:** classmates who receive the link (through the share button or the QR code).
- Language of study content: Thai with English technical terms. Language of project documents and code: English.

## 3. Goals

1. See the whole exam scope at a glance on Home, as an interactive diagram, and reach any formula in two taps or fewer.
2. Read every worked example comfortably on a 360 px wide phone and on a desktop, including wide matrices, HTML tables and SVG figures.
3. Work offline after the first visit.
4. Make content changes cheap: edit one Markdown file, push, the site updates.
5. Look like a calm research lab, following `DESIGN-cohere.md` (white editorial canvas, deep green and navy bands, soft-stone cards, near-black pills, coral as a rare warm marker), with polished, purposeful animation.
6. Share the site in one tap (native share sheet on phones, a QR code and copy-link dialog elsewhere).

## 4. Non-goals

- No backend, accounts, comments, analytics, or user data of any kind. Nothing is stored about the visitor.
- No dark theme (light only; Cohere's dark appears only as bands and panels inside the light page).
- No footer.
- No content beyond the three Markdown files of the midterm. The lecturer's slides, notebooks and Python files in `docs/` are not part of the site.
- No in-browser Markdown rendering. No editing UI. No search in the first release.
- No marketing sections from the design source (announcement bar, trust-logo strip, newsletter, forms). Only the design language is borrowed.
- No "hide solutions" switch in the first release (see `PLAN.md` Future).

## 5. Information architecture

Four pages, all client-side routes (`HashRouter`):

| Page | Route | Source content |
|---|---|---|
| Home | `#/` | the node trees of all three Markdown files |
| Regression | `#/regression` | `content/midterm/Regression.md` |
| Classification | `#/classification` | `content/midterm/Classification.md` |
| Clustering | `#/clustering` | `content/midterm/Clustering.md` |
| Not found | `*` | none |

A topic page can be opened at a given section with `#/classification?s=1.2` (used by the Home diagram and by shared links).

Navigation: a top navbar only (logo left, three page tabs centered, share button right). No footer. Phones use a hamburger that opens a menu panel with one row per page.

## 6. Features

### F1 Home: exam-scope diagram (core feature)
An interactive, animated diagram that grows to the right, carried over from the 1322201 site and restyled. Root node "Midterm" toggles open. Open: the three topics slide out, connected by curves, each tagged Supervised or Unsupervised. Open a topic: its sections appear in the next column (Regression: 3, Classification: 4, Clustering: 1). Open a section that has sub-topics (K-NN): its sub-topics appear in the next column. Open a leaf: an expanded block shows the explanation and the formulas, a "ดูตัวอย่าง (N)" button opens the worked examples in the next column, and an "อ่านในหน้าเนื้อหา" link opens the topic page at that section. Nothing overlays anything. Detailed behavior: `UI-SPEC.md` section 4.

### F2 Home: hero and diagram
Above the diagram a compact editorial hero (course label, title, one Thai lead line, three numbers counted from the content, an animated thin-line illustration). The diagram is full width with no frame, as on the 1322201 site. There is nothing below it (the topic cards were removed after launch).

### F3 Topic pages
One long page per big topic: a coloured feature band (hero) with the topic illustration, an overview panel with the page's shared formulas, then every section in source order with its theory and formulas, and every example as a card with the problem, `Sol`, the steps, and the `Ans` strip. A collapsible contents rail on the left (icon toggle, no label) with progress rings, a drawer on phones, a reading-progress line and a back-to-top button.

### F4 Share
A share button in the navbar. On devices with the Web Share API it opens the native share sheet with the current page address. Otherwise it opens a centered dialog with a QR code of the address and a copy-link field (carried over from 1322201, own QR encoder, no dependency).

### F5 Animation
Hero entrances and count-ups, three topic illustrations (a line fitting through points, a K-NN query circle, points moving to their centroids), diagram column slides and connector draw-in, section and card reveals, rail highlight and rings, drawer spring, jump-arrival underline, back-to-top ring, share dialog. Detailed in `UI-SPEC.md` section 9. Everything respects `prefers-reduced-motion`.

### F6 Responsive layout
Phone portrait, phone landscape, tablet, desktop, wide. See `UI-SPEC.md` section 8.

### F7 Offline
After the first load the whole site (pages, formulas, SVG figures, fonts) works with no network. A new version is applied automatically, with a toast as a backup.

### F8 Brand
Name "ML Notes". Original logo (`UI-SPEC.md` section 11): three data points on a rising fitted line, the last point coral. No Cohere, Anthropic or Claude marks.

## 7. Content requirements

- Markdown is the single source of truth. Thai text is preserved character for character. The pipeline never rewrites wording.
- Math is KaTeX. Tables are HTML `<table>` blocks in the Markdown, parsed into typed tables. Figures are inline SVG using `currentColor`. See `CONTENT-SCHEMA.md`.
- The three files keep their current shapes (`#` title, `##` numbered sections, `###` numbered sub-topics or examples, examples headed `ตัวอย่างโจทย์`, a `Sol<sup>n</sup>` heading, an `**Ans**` paragraph). The pipeline adapts to them; the content is not reshaped for the site.

## 8. Non-functional requirements

| Area | Requirement |
|---|---|
| Performance | App shell under 150 KB gzip JS+CSS (no animation library); each content chunk under 150 KB gzip (fonts and KaTeX CSS excluded); LCP under 2.5 s on a mid-range phone over 4G; math pre-rendered at build time; animations use transform and opacity only |
| Accessibility | WCAG 2.2 AA contrast with the token pairings in `UI-SPEC.md` section 12 (coral and muted never carry text on white), full keyboard operation of the diagram, rail, drawer, menu and share dialog, `prefers-reduced-motion` honored, correct heading order, labels for icon-only controls and every figure |
| Compatibility | Last 2 versions of Chrome, Safari, Firefox, Edge; iOS Safari 16+ |
| Reliability | Build fails if any formula fails KaTeX strict, any SVG breaks the rules, an HTML tag is not on the allow list, a heading shape is not recognised, or the round-trip test fails |
| Maintainability | Feature-first structure, strict TypeScript, tested content pipeline, documents kept in sync |
| Hosting | GitHub Pages only (`https://kanawatkha.github.io/ML_Notes/`), deployed by GitHub Actions |

## 9. Acceptance criteria

1. The three Markdown files convert without error or warning and the round-trip test passes.
2. Home: the root opens to three topics, every section and sub-topic opens to its block, every leaf with examples opens its example column, and every "อ่านในหน้าเนื้อหา" link lands on the right section.
3. Each topic page renders all of its Markdown: 3 + 4 + 1 sections, 4 K-NN sub-topics, 18 examples (4 + 12 + 2), every table, formula and figure. Counts are snapshot-tested.
4. The rail (desktop) and drawer (phone) reach every section, sub-topic and example; the highlight follows scrolling.
5. Share opens the native sheet where supported, otherwise the QR dialog; the QR code scans to the current address; copy works.
6. All animations in `UI-SPEC.md` section 9 work, hold 60 fps on a mid-range phone in a manual check, and are off under `prefers-reduced-motion`.
7. Layouts verified at 360x640, 390x844, 768x1024, 1024x768, 1440x900 and phone landscape 844x390 with no horizontal page scroll except inside the diagram canvas, wide math, tables and figures.
8. Offline test: load once, switch the network off, reload and visit all four pages.
9. `npm run build` is green in CI and the site is reachable at the Pages URL.
10. Lighthouse (mobile): Performance 90+, Accessibility 95+, Best Practices 95+.

## 10. Risks and open items

| Item | Handling |
|---|---|
| The design's fonts (CohereText, Unica77, CohereMono) are proprietary | Use the documented fallbacks (Space Grotesk, Inter) plus IBM Plex Mono for mono labels; recorded as an addendum in `UI-SPEC.md` section 1, the design file stays untouched |
| None of those fonts has Thai glyphs | Thai falls through to IBM Plex Sans Thai (`UI-SPEC.md` Addendum A), to be confirmed on a real phone in Phase 3 |
| Display tokens (96/72/60 px, line height 1.0, negative tracking) clip Thai tone marks and do not fit phones | Responsive scale-down and a 1.25 minimum line height for any text that may contain Thai (`UI-SPEC.md` Addendum B); tokens unchanged |
| Coral `#ff7759` on white is 2.6:1 and muted `#93939f` is 3.0:1 | Never used for text on light surfaces; rules in `UI-SPEC.md` section 12 |
| The content uses HTML tables and headings as Sol markers, unlike the reference projects | The pipeline is extended for these shapes (`CONTENT-SCHEMA.md`); the Markdown is not rewritten |
| `docs/` holds lecturer slides, notebooks and code in the public repository | Not used by the site and excluded from the build. The user approved pushing them earlier; whether they stay public is the user's decision (ask, do not act) |
| Diagram complexity on small screens | Same right-growing layout as 1322201, which is proven on phones; checked again in Phase 5 |
| Many animations on long pages can hurt phones | Transform/opacity only, one shared IntersectionObserver, reveal once, batch mounting, CSS instead of a library; measured in Phase 6 |
| Offline caching serving stale content | Version check plus prompt toast, carried over from the reference projects |
