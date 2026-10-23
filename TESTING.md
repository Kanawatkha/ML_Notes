# TESTING

What is checked, how, and when. The goal is that wrong content or a broken layout can never reach GitHub Pages.

## 1. Test layers

| Layer | Tool | Runs | Fails the build |
|---|---|---|---|
| Content pipeline | Vitest + build-time checks | `npm run test`, `npm run build` | yes |
| Content correctness (authoring) | Scripts in the `verify-math` skill | when content changes | no (author gate, required before commit) |
| Types, lint, format | `tsc`, ESLint, Prettier | CI | yes |
| Components | Vitest + Testing Library | `npm run test` | yes |
| Accessibility | axe-core in Vitest (structure) and in a real browser (rendered contrast) | Phase 7 and before release | yes for serious/critical |
| Performance | Lighthouse (mobile preset) by hand; frame rate on a real phone | Phase 7 and before release | budget warnings |
| Offline | A real browser, by hand | Phase 8 and before release | no |

Decision D15 in `PLAN.md`: no Playwright e2e suite by default. Add it only if the user asks.

## 2. Content pipeline checks (Phase 2)

1. **Parse coverage.** Every file declared in `PAGES` parses. A file not in `PAGES` is never read (test: a broken file placed in `content/midterm/` does not fail the build). Unknown constructs, HTML tags or attributes fail with file and line.
2. **Round trip.** Convert generated data back to normalized text and compare with the normalized Markdown. Normalization: collapse whitespace, drop `---` rules and `<div align="center">` wrappers, decode `&nbsp;`, flatten HTML tables to their cell texts in order, keep math source verbatim, account for the Sol headings and the `**Ans**` lead. Zero diff is required. This guarantees "the same words as the Markdown".
3. **KaTeX strict.** Every inline and display formula compiles with `throwOnError: true, strict: 'error'` and produces no warning (Thai only inside `\text{}`).
4. **SVG rules.** No blank line, well-formed XML, `viewBox` and `aria-label` present, no scripts or event handlers, no external references, `currentColor` only, ids unique per page after rewriting.
5. **Table rules.** Allowed tags and attributes only, closed tags, head rows detected, row-header cells kept, empty cells kept.
6. **Tree rules.** Unique ids; sub-topic numbers under their section; every example has exactly one Sol heading; no Sol heading or `**Ans**` outside an example; overview entries created where `explain` is non-empty.
7. **Counts snapshot.** Committed and reviewed on change. Expected today:

| | Regression | Classification | Clustering | Total |
|---|---|---|---|---|
| Sections | 3 | 4 | 1 | 8 |
| Sub-topics | 0 | 4 | 0 | 4 |
| Leaves | 3 | 7 | 1 | 11 |
| Examples | 4 | 12 | 2 | 18 |
| Tables | 9 | 28 | 8 | 45 |
| Figures | 0 | 6 | 1 | 7 |
| Display formulas | 73 | 123 | 37 | 233 |

8. **Stats.** `home.json` and `meta.json` numbers equal the counts above (the hero numbers are never typed by hand).

Fixtures live in `tests/fixtures/` and cover each construct of `CONTENT-SCHEMA.md` section 2: example under a section, example under a sub-topic (Sol at level 5), example title with math, example without Ans (warning), HTML table with row headers and empty cells, `<b>` in a cell, figure with a marker id, bold label paragraph, step paragraph, overview before the first `##`; and the error cases: unknown tag, unclosed `<td>`, Sol outside an example, two Sol headings, sub-topic number mismatch, hex colour in SVG, heading level 6.

## 3. Verifying the content itself (authoring)

Before any number, matrix, distance, weight, entropy or centroid is written into the Markdown it is verified by program. See `.claude/skills/verify-math/SKILL.md`. Minimum bar:

- Regression: `R = Y Xᵀ (X Xᵀ)⁻¹` (and the `εI` variant) with NumPy; every intermediate matrix, determinant, adjugate and inverse; predictions, MAE and MSE.
- K-NN: every distance (Euclidean, squared, Manhattan, cosine) and the sorted order; votes and ties (first wins); K-NN regression averages.
- Perceptron: replay every pass of the update rule exactly as written (with or without `η`); every dot product.
- FFBP: forward, backward and update in matrix form, at the rounding the notes use; compare with full precision and report any difference in the last shown digit.
- ID3: every count, entropy (log base 10), weighted sum and gain; the chosen attribute per node; the data-structure table against the tree.
- K-Means: every distance table, label, centroid update and the stop condition.
- State the rounding rule (decimals shown) and keep it the same as the surrounding steps.

## 4. Component tests

- Block renderer: one test per block type and flag (label, step, header cells, Sol label, Ans strip); an unknown block type is a TypeScript error.
- `ExampleCard`: problem, Sol label and Ans in order; EX number; works inside the diagram and on a page.
- Topic page: hero from meta; overview only when present; every section, sub-topic and example of the real content in the DOM once mounted; `?s=` lands on the node.
- Rail: levels match the data; only the active section (and sub-topic) expanded; `aria-current="location"` follows the active anchor; selecting calls `jumpTo`; toggle is icon-only with a changing accessible name; drawer traps focus, closes on `Esc` and scrim, locks scroll.
- Diagram model: one open node per column, closing a parent closes descendants, overview entries, example column toggling, URL state round trip.
- Diagram component: every leaf of all three topics opens its block; "ดูตัวอย่าง (N)" shows N cards; "อ่านในหน้าเนื้อหา" points at `#/<page>?s=<id>`; `Esc` returns focus to the parent; live region messages.
- Navbar and mobile menu: tabs from `PAGES`, `aria-current="page"`, menu focus trap, `Esc`, closes on navigation.
- Share: Web Share path used when available and the pointer is coarse; dialog otherwise; copy success and failure; QR matrix decodes back to the URL (unit test on `lib/qr.ts`).
- Motion helpers: reveals render final state under reduced motion; `CountUp` puts the final number in the DOM from the start; the shared observer reveals once and disconnects; illustrations render their final frame under reduced motion.

## 5. Accessibility and layout checks

Run at 360x640, 390x844, 768x1024, 1024x768, 1440x900 and phone landscape 844x390.

1. All four routes load without console errors.
2. No horizontal page scroll (`document.scrollingElement.scrollWidth <= innerWidth`); diagram, tables, math and figures scroll inside their own wrapper.
3. Home: open Midterm, each topic, each section and sub-topic, one leaf per topic, press "ดูตัวอย่าง"; no two blocks overlap (bounding boxes disjoint) and the newest column is visible after the auto-scroll.
4. Keyboard: the diagram, tabs, menu, share dialog, rail and drawer can be used with Tab, Enter, Space, arrows and Esc only; the focus ring is always visible.
5. axe: zero serious or critical violations on every route, with the diagram open, the drawer open, the menu open and the share dialog open.
6. `prefers-reduced-motion` emulation: every item behaves as in `UI-SPEC.md` section 9 rules.
7. Heading order: `h1` page, `h2` section, `h3` sub-topic or example, `h4` example in a sub-topic; no skipped levels.
8. Thai: tone marks not clipped in any heading size; table cells do not break words mid-syllable.
9. Animation: scroll each topic page at phone width with the Performance panel recording: no long tasks from reveals, CLS under 0.1, scroll near 60 fps; opening the diagram's deepest column does not drop frames noticeably.

## 6. Offline test (Phase 8)

1. `npm run build`, then `npm run preview`, open `http://localhost:4173/ML_Notes/` in a real browser (DevTools, Application, Service Workers: `sw.js` active for scope `/ML_Notes/`).
2. Wait for "ใช้งานออฟไลน์ได้แล้ว".
3. Set the network offline and reload; visit all four pages. Formulas, tables, figures, fonts, icons, the diagram and the rail must work.
4. Online again, rebuild, wait up to a minute or switch tabs: the page reloads by itself, or shows "มีเวอร์ชันใหม่ พร้อมใช้งาน" with "โหลดใหม่".
5. On a phone: open the live site, add it to the home screen, airplane mode, open it from the icon.

Checked by Claude in the desktop preview pane in Phase 8: registration, the offline toast and an offline reload of all four pages (the preview server was stopped). Checked by unit tests: manifest, icon files, toast host, version check. Steps 4 and 5 (a real update, the phone) are for the user. Other projects served from `localhost:4173` share the origin and leave their own caches there; that is harmless but unregister them first if a test looks odd.

## 7. Performance budgets

| Metric | Budget |
|---|---|
| App shell JS + CSS, gzip | under 150 KB |
| Each page chunk (generated JSON), gzip | under 150 KB |
| `home.json` + `meta.json`, gzip | under 10 KB |
| LCP (mobile, 4G profile) | under 2.5 s |
| Cumulative Layout Shift | under 0.1 |
| Lighthouse mobile | Performance 90+, Accessibility 95+, Best Practices 95+ |

Measured in Phase 9 (Lighthouse 13 mobile preset: slow 4G simulation and 4x CPU slowdown, production preview, Chrome headless):

| Page | Performance | Accessibility | Best Practices | SEO | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|
| Home | 95 | 100 | 100 | 100 | 1.9 s | 2.7 s | 20 ms | 0.01 |
| Regression | 94 | 100 | 100 | 100 | 1.9 s | 2.7 s | 120 ms | 0 |
| Classification | 93 | 100 | 100 | 100 | 1.9 s | 2.7 s | 150 ms | 0 |
| Clustering | 93 | 100 | 100 | 100 | 1.9 s | 2.7 s | 180 ms | 0 |

Scores move by a few points between runs. LCP is 0.2 s over the 2.5 s budget under that harsh simulation; in the desktop preview without throttling it is 0.4 s. What was done: first-paint fonts and the small route chunks are preloaded (`preloadFirstPaint` in `vite.config.ts`), the topic page shows nothing under the hero until the hero has arrived (this removed a 0.149 layout shift), and a topic page mounts only 2 parts at first.

Fonts and KaTeX fonts are outside the JS+CSS budget but are subset and weight-limited (`UI-SPEC.md` Addendum A), `font-display: swap`, first-paint files preloaded.

## 8. CI gates

`ci.yml` on every push to a branch other than `main` and on pull requests: `npm ci`, `lint`, `format:check`, `typecheck`, `test`, `build`. `deploy.yml` on `main` runs the same checks before it publishes. See `DEPLOY.md`.

## 9. Manual checks before each release

- Open Home and each topic page on a real phone, portrait and landscape; read a table-heavy card (K-NN, K-Means) and a figure (FFBP, ID3 trees).
- Compare three random example cards with the Markdown preview in VS Code.
- Share from a phone (native sheet) and from a laptop (QR dialog); scan the QR code.
- Install as PWA, go offline, open each page.
- Read the build report for warnings.
