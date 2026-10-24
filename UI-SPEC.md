# UI-SPEC

Pages, components, interactions, animation and responsive behavior. Visual tokens (colors, type, radius, spacing) come from `DESIGN-cohere.md`, which is used as-is and never edited; this file says where and how they are used and records the addenda the design file does not cover. Light theme only.

## 1. Global rules and addenda

### Rules

- **Canvas is `canvas` (#ffffff)**; text is `ink` (#212121). The page rhythm follows Cohere: white editorial space, one oversized headline per page, then restrained 16 to 24 px copy; colour arrives in **bands** (a topic's feature band) and **media cards** (the illustrations), never as broad UI fills.
- **Topic colours.** Each big topic owns one dark band colour from the design: Regression `dark-navy` (#071829), Classification `deep-green` (#003c33), Clustering `primary` (#17171c). The colour appears only in that topic's hero band, its swatch on Home and the menu, and its illustration field. Text on a band is `on-dark`.
- **Coral (`coral` #ff7759) is a rare warm marker**, never text on a light surface (2.6:1). Allowed: the reading-progress fill, the active connector end dot on Home, the logo's last point, the jump-arrival underline, chip outlines next to `ink` text, and text on dark bands (4.7:1 or more).
- **`muted` (#93939f) and `slate` (#75758a) are not used for text on light surfaces** (3.0:1 and 4.5:1 at the edge). Secondary text uses `body-muted` (#616161, 6.2:1). `muted` is allowed for decorative strokes and on `primary` (5.9:1).
- Links inside content are `action-blue` with an underline. Navigation links are `ink`.
- **Flat.** Depth comes from surface alternation (white, `soft-stone`, dark bands), 1 px rules (`hairline` #d9d9dd, `border-light` #e5e7eb, `card-border` #f2f2f2) and rounded corners. No drop shadows on cards. The only shadows: the share dialog and the drawer (overlays), soft and short.
- No gradients as UI fills. The illustrations may use flat fills and strokes only.
- Focus is always visible: 2 px `focus-blue` (#4c6ee6) outline with 2 px offset; on dark bands a 2 px `on-dark` outline (any element with `data-surface="dark"` switches the ring for its descendants).
- Pills: primary actions are `button-primary` (near-black pill, radius `pill` 32, padding 12 x 24). Companion actions are `button-secondary` (text link, underline). Filters, tabs and tags are `button-pill-outline` (1 px `primary` border, radius `xl` 30).
- Max content width 1200 px. Topic pages: the content column takes the room the rail leaves (no cap on desktop, 880 px cap on tablet and phone).
- Every sideways-scrolling area (diagram canvas, tables, display math, figures) can be panned with the right mouse button held down (`src/lib/dragScroll.ts`, carried over from 1322201); touch keeps native scrolling.
- UI labels shown to students are Thai (or the English topic names). Code, comments and docs are English.

### Addendum A: fonts (design file untouched)

The design's fonts (CohereText, Unica77 Cohere Web, CohereMono) are proprietary. The design file lists fallbacks; we use them, plus a real monospace for the mono labels, plus a Thai face. All are SIL OFL and self-hosted through `@fontsource`.

| Role | Design font | Stack used |
|---|---|---|
| Display (`hero-display`, `product-display`, `section-display`) | CohereText | `"Space Grotesk", "IBM Plex Sans Thai", system-ui, sans-serif` |
| Headings, body, UI (`section-heading` to `micro`) | Unica77 | `"Inter Variable", "IBM Plex Sans Thai", system-ui, sans-serif` |
| Mono labels (`mono-label`) | CohereMono | `"IBM Plex Mono", "IBM Plex Sans Thai", ui-monospace, monospace` |

**Thai: IBM Plex Sans Thai** (400, 500, 600; Thai subset only). Why: it was drawn as part of the Plex family, so it sits naturally next to Plex Mono and the grotesk display face and gives the "research lab" tone of the design; its looped forms stay readable in long Thai explanations; tone marks are clear at small sizes. Weight map: Thai body and headings 400 (the same weight as the Latin face beside it; a heavier Thai heading looked bold next to Space Grotesk and Inter in the Phase 3 check), Thai labels and buttons 500, 600 kept for bold runs. Alternatives if it reads poorly on a real phone: Anuphan (loopless, closer to Space Grotesk) for headings, or Noto Sans Thai. Decision D9 in `PLAN.md`.

Loaded files: Space Grotesk 400/500 (Latin), Inter variable (Latin), IBM Plex Mono 400/500 (Latin), IBM Plex Sans Thai 400/500/600 (Thai). The first-paint files are preloaded; `font-display: swap`.

### Addendum B: responsive type scale and Thai line height

The tokens are desktop values. Display tokens have line height 1.0 and negative tracking; that clips Thai tone marks. Rules:

- Display tokens are used **only for Latin-only text** (the site name, the topic names "Regression", "Classification", "Clustering", "404"). Any text that may contain Thai uses `section-heading` or smaller.
- Any token used with Thai text gets line height at least 1.25 (headings) or 1.65 (body), and no negative tracking.

| Token | Use | >= 1024 | 768-1023 | 425-767 | < 425 |
|---|---|---|---|---|---|
| `hero-display` | Home title "ML Notes" | 96 px | 80 px | 60 px | 48 px |
| `product-display` | topic page title | 72 px | 60 px | 48 px | 40 px |
| `section-display` | 404 | 60 px | 56 px | 48 px | 40 px |
| `section-heading` | Home section titles (Thai) | 48 px | 40 px | 32 px | 28 px |
| `card-heading` | topic section title (`##`) | 32 px | 30 px | 26 px | 24 px |
| `feature-heading` | sub-topic (`###` numbered), example title, diagram block title | 24 px | 24 px | 21 px | 20 px |
| `body-large` | hero lead | 18 px | 18 px | 17 px | 17 px |
| `body` | content | 16 px | 16 px | 16 px | 16 px |
| `button`, `caption`, `mono-label` | controls, labels | 14 px | 14 px | 14 px | 14 px |
| `micro` | toast meta, QR hint | 12 px (Latin) / 13 px (Thai) | | | |

Implemented as `type-hero`, `type-product`, `type-section-display`, `type-section-heading`, `type-card-heading`, `type-feature-heading`, `type-body-lg`, `type-body`, `type-button`, `type-caption`, `type-mono`, `type-micro` utilities in `src/styles/index.css`. `type-mono` is uppercase with 0.02 em tracking and is applied to Latin labels only; Thai labels never use uppercase or mono.

Numbers that animate or align (stats, table cells) use `tabular-nums`.

### Addendum C: what is borrowed and what is not

Borrowed: colors, type roles, radii, spacing, `button-primary`, `button-secondary`, `button-pill-outline`, the dark feature band, `hero-photo-card` (as the illustration card), `product-card` (Home topic cards), `research-table` chrome (content tables), `contact-form-card` (diagram blocks, share dialog), `agent-console-card` (toast), `capability-card` top rule (section headers), the three-zone navbar, the mobile menu, thin-line geometric illustration style.
Not used: announcement bar, trust-logo strip, blog filter chips at hero size, contact forms, newsletter footer, photography, the company's name, logo, copy and imagery.

### UI strings (Thai)

| Key | Text |
|---|---|
| site name | ML Notes |
| course label (mono, Latin) | 1322308 MACHINE LEARNING · MIDTERM |
| home lead | สรุปสูตรและวิธีทำโจทย์คำนวณ แนวข้อสอบกลางภาค |
| home stat labels | หัวข้อใหญ่ / หัวข้อย่อย / ตัวอย่างโจทย์ |
| home diagram title | แผนผังแนวข้อสอบ |
| home diagram hint | กดที่ Midterm เพื่อเปิดแผนผัง |
| topic card action | เปิดหน้า |
| tabs | Regression / Classification / Clustering (Home through the logo and the menu) |
| menu row Home | หน้าหลัก |
| topic tags (mono, Latin) | SUPERVISED / UNSUPERVISED |
| page stat labels | หัวข้อ / ตัวอย่างโจทย์ |
| overview panel label | ภาพรวม |
| open in page | อ่านในหน้าเนื้อหา |
| example index chip (mono, Latin) | EX 01, EX 02, ... |
| root node | Midterm |
| share button / dialog title | แชร์ / แชร์หน้านี้ |
| share hint | สแกน QR หรือคัดลอกลิงก์ |
| copy link / copied | คัดลอกลิงก์ / คัดลอกลิงก์แล้ว |
| menu open / close (aria) | เมนู / ปิดเมนู |
| rail toggle (aria only) | เปิดสารบัญ / ปิดสารบัญ |
| rail landmark (aria) | สารบัญ |
| back to top (aria) | กลับขึ้นบน |
| reading progress (aria) | ความคืบหน้าการอ่าน |
| diagram region (aria) | แผนผังแนวข้อสอบ |
| loading | กำลังโหลด... |
| load error / retry | โหลดเนื้อหาไม่สำเร็จ / ลองอีกครั้ง |
| not found / back | ไม่พบหน้านี้ / กลับหน้าหลัก |
| update toast / action | มีเวอร์ชันใหม่ พร้อมใช้งาน / โหลดใหม่ |
| offline ready toast / dismiss | ใช้งานออฟไลน์ได้แล้ว / ปิด |

All strings live in `src/config/site.ts` (`UI_TEXT`). Course text (titles, formulas, problems) is never in this table: it comes from the Markdown. The "Sol" and "Ans" labels come from the Markdown too (`Sol<sup>n</sup>` heading, `**Ans**` paragraph).

## 2. Shell and routes

| Route | Page | Data |
|---|---|---|
| `#/` | Home | node trees of the three files (`generated/home.json`) |
| `#/regression` | Regression | `generated/regression.json` |
| `#/classification` | Classification | `generated/classification.json` |
| `#/clustering` | Clustering | `generated/clustering.json` |
| `#/<topic>?s=<node>` | the topic page, scrolled to node `<node>` (for example `s=1.2`, `s=2-ex1`) | same |
| `*` | Not found | none |

Every page sets `document.title` to `<page> | ML Notes` (Home: `ML Notes`) and moves focus to the main heading on navigation. No footer.

```
<Navbar />             sticky, 64 px (56 px phone landscape)
<ReadingProgress />    topic pages only, 2 px under the navbar
<main>                 route content
<ToastHost />          bottom-left
```

### Navbar (Cohere three-zone)

- White, sticky. A `hairline` bottom rule fades in after 8 px of scroll.
- **Left:** logo mark + wordmark "ML Notes" (Space Grotesk 500, "ML" `ink`, "Notes" `body-muted`), links to Home. Below 425 px only the mark and "ML".
- **Center (>= 768):** the three tabs, `type-button`, `ink`. Inactive: plain text with 8 x 14 px padding. Active: `button-pill-outline` (1 px `primary` border, radius 30) and `aria-current="page"`. Each tab has a 8 px dot in its topic colour before the label.
- **Right:** share button. >= 768: `button-pill-outline` with a share icon and "แชร์". < 768: a 44 px icon-only circle (same outline) followed by the hamburger.
- **< 768:** tabs move into the mobile menu.

### Mobile menu (< 768)

- A white panel that slides down from under the navbar, exactly as tall as its rows (4 x 64 px), over a dimmed and blurred page (the same overlay as the share dialog); a press on the page below closes it. This is the compact mobile menu the design describes, and the behavior of the 1322201 site.
- Rows in this order: หน้าหลัก, Regression, Classification, Clustering. Each row 64 px: mono index (`01` to `03`, none for Home), the topic colour swatch (12 px rounded square), the title in `type-feature-heading`, a chevron at the right. Rows separated by `hairline` rules (research-table rhythm).
- The hamburger morphs into a cross (A15). Closes on row press, cross, `Esc`, route change or back gesture. Focus is trapped, body scroll is locked, focus returns to the hamburger.

## 3. Home (`#/`)

```
<HomeHero />            split hero: text left, illustration card right (stacked on phones)
<section> แผนผังแนวข้อสอบ
  <HomeDiagram />       full width, no frame: starts at the content column's left edge, grows right
</section>
```

Vertical rhythm: `section` (80 px) between the three parts on desktop, 48 px on phones.

### HomeHero

- Desktop (>= 1024): two columns, 6/12 text, 6/12 card; tablet and phone: stacked, card below.
- Text: course label (`type-mono`, `body-muted`), title "ML Notes" (`type-hero`, `ink`, tracking -0.02 em), lead (`type-body-lg`, `ink`), then a stat row of four items separated by vertical `hairline` rules: big number in `type-card-heading` (Space Grotesk, `tabular-nums`) with its Thai label under it in `type-caption` `body-muted`. Numbers are computed from the content: 3 big topics, 11 leaf topics, 28 examples, 27 exercises (snapshot-tested).
- Illustration card (`hero-photo-card`): radius `lg` 22, `deep-green` field, a 4:3 drawing (on phones limited to 45% of the viewport height), holding the **Home illustration** (A3): a thin-line plot in `on-dark` at 70% opacity with `coral` accents.
- No call-to-action button (the diagram is right below). A small `button-secondary` "แผนผังแนวข้อสอบ ↓" link scrolls to the diagram on phones only.

There are no topic cards on Home: it is the hero and the diagram only (changed after Phase 9, at the owner's request).

## 4. Home diagram (core feature)

Carried over from the 1322201 `features/home-diagram` (model, layout hook, connectors, leaving columns), restyled with Cohere tokens and adapted to the ML tree. Since v1.2 it shows the scope only: the topics and their sub-topics. It never shows explanation, formulas or examples; a leaf is a link to its part of the topic page.

### 4.1 Tree

| Column | Content | Appears when |
|---|---|---|
| 0 | Root "Midterm" | always |
| 1 | Topics: Regression, Classification, Clustering | root is open |
| 2 | Sections of the open topic (`##`): a button for a group, a link for a leaf | a topic is open |
| 3 | Sub-topics of the open section (`###` numbered), all links | the open section is a group (only K-NN today) |

Leaf and group rules come from `CONTENT-SCHEMA.md` section 5. Today: Regression Linear, Polynomial, K-NN Regression (3 links); Classification K-NN (a group with Euclidean, Cosine, Squared Euclidean, Manhattan), Perceptron, FFBP, ID3 (links); Clustering K-Means (a link).

### 4.2 Behavior

1. Initial state: root closed, only the root and a one-line hint ("กดที่ Midterm เพื่อเปิดแผนผัง") are visible.
2. Pressing the root toggles it. Closing the root collapses everything.
3. **One open node per column.** Opening another node in a column closes the previous one and its descendants.
4. Nothing overlays anything. Columns sit in normal flow side by side; the canvas widens as columns open.
5. A leaf is a link to `#/<topic>?s=<node>` (the section or sub-topic on the topic page). It never opens a column.
6. When a column opens, the canvas scrolls horizontally (smooth) so the new column's left edge sits 16 px inside the canvas, unless it is already fully visible.
7. State in the URL: the open path is mirrored in the hash query (`#/?p=classification:1`), so a diagram state can be shared and survives a reload. An old address with `&x=1` (the former example column) still opens the same path and the flag is ignored. Decided D16.

### 4.3 Visuals

| Element | Style |
|---|---|
| Canvas | No frame: full viewport width, the first column starts at the left edge of the 1200 px content column, horizontal scroll, min height 320 px |
| Root | `button-primary` pill, 56 px high, "Midterm", a plus icon that rotates into a minus when open |
| Topic node | White card, 1 px `hairline`, radius `md` 16, padding 20; top row: mono tag and topic colour swatch; title `type-feature-heading` (Latin); caption `body-muted` "3 หัวข้อ" (count from the data) |
| Section / sub-topic node | White, 1 px `hairline`, radius `sm` 8, padding 16; mono number (`01`, `1.1`) in `body-muted`, title `type-body` weight 500 |
| Leaf (link) | Same as a section node; the border turns `ink` on hover |
| Open node | 1 px `ink` border, the chevron turned; the coral dot sits at the connector's end beside it; fill stays white |

Connectors: cubic Bezier from the parent's right-middle to each child's left-middle, `hairline` 1.5 px. The open path is `ink` 2 px with a 6 px `coral` dot where it meets the open child.

### 4.4 Layout engine

- Each column is a vertical flex stack inside one horizontal flex row (the scroll container).
- A child column is centered on its open parent, clamped to the top of the canvas.
- One absolutely positioned SVG layer behind the columns draws the connectors from measured rectangles (`ResizeObserver`, window resize, orientation change).
- Gaps between columns: 48 px desktop and tablet, 32 px phone.

| Column | >= 1024 | 768-1023 | < 768 |
|---|---|---|---|
| Root | 168 px | 160 px | 140 px |
| Topic | 260 px | 248 px | min(76vw, 260 px) |
| Section / sub-topic | 280 px | 264 px | min(78vw, 280 px) |

### 4.5 Keyboard and screen reader

- A node with children is a `<button>` with `aria-expanded` and `aria-controls` pointing at its child column; a leaf is a link.
- Tab order follows visual order. `Enter` or `Space` toggles a button, `Enter` follows a link. `Esc` closes the deepest open node and returns focus to its parent. `ArrowUp`/`ArrowDown` move within a column, `ArrowRight` to the first child, `ArrowLeft` to the parent.
- The canvas is a `region` labelled "แผนผังแนวข้อสอบ". A polite live region announces "เปิด <title>" and "ปิด <title>".
- The connector layer is `aria-hidden`.

## 5. Topic pages (`#/regression`, `#/classification`, `#/clustering`)

```
<Navbar /> <ReadingProgress />
<main>
  <TopicHero />                   coloured feature band
  <div grid>                      >= 1024: [ 264 px rail | content ], toggle in the page margin
    <Rail />                      sticky, foldable; < 1024: drawer
    <article>
      <OverviewPanel />           the page's shared formulas (when present)
      <Section /> x N             header, explanation, sub-topics, example cards
    </article>
  </div>
</main>
<RailToggle />  <BackToTop />
```

### 5.1 TopicHero (`dark-feature-band`)

- Inside the 1200 px container, radius `lg` 22, background = the topic colour, text `on-dark`; padding 80 px desktop, 48 px tablet, 32 px phone (the design's 80 px band padding scaled down).
- Left (7/12): mono tag (`SUPERVISED · 01 / 03`, `on-dark` at 80%), title in `type-product` (the `#` heading, Latin), the lead paragraph (the first paragraph of the file, `type-body-lg`, `on-dark`; Thai), then a stat row: หัวข้อ (sections and sub-topics) and ตัวอย่างโจทย์ (examples), numbers in `type-card-heading`, counted from the data.
- Right (5/12; below the text on phones): the topic illustration (A4) in a darker translucent card (`cohere-black` at 25%, radius `md` 16, 1 px `on-dark` at 15% border), thin `on-dark` lines with `coral` accents.

### 5.2 OverviewPanel

- Shown when the file's `#` node has explanation blocks after the lead paragraph (Regression today: the shared formulas).
- `soft-stone` panel, radius `md` 16, padding 32 (20 phone); a Thai label "ภาพรวม" (`type-caption` 500, `body-muted`) at the top; blocks rendered by `BlockRenderer`.
- Paragraphs that are only a bold label (for example `**Linear (Degree 1)**`) render as small sub-headings inside the panel (`type-body` weight 600) with 24 px space above.

### 5.3 Section (`##`)

- `SectionHeader` (Cohere capability card with a top rule): a 1 px `ink` rule across the column, then a row with the mono number (`01`) and the title in `type-card-heading`. 96 px above each section (64 px phone).
- The section's explanation blocks follow directly on white (unframed, as the design suggests for editorial content). Bold-label paragraphs (`**ขั้นตอน**`, `**สรุปสูตร**`, `**Forward**`) render as inline sub-headings like in the overview panel.
- `###` numbered sub-topics (`1.1 Euclidean`): a `button-pill-outline`-shaped number chip (`1.1`, mono) next to the title in `type-feature-heading`; 48 px above.

### 5.4 Example card

```
[ EX 03 ]  ตัวอย่างโจทย์ 2                          mono chip (coral outline, ink text) + feature-heading
problem blocks (text, tables, figures)
[ Solⁿ ]                                             label pill, soft-stone fill, ink text, from the Markdown heading
solution blocks (steps, formulas, tables, figures)
Ans strip                                            pale-green fill, 3 px deep-green bar on the left, the **Ans** paragraph
```

- White, 1 px `hairline`, radius `md` 16, padding 32 (20 phone), 24 px between cards.
- The running example number (`EX 01` ...) is generated per page; the heading text stays exactly as written.
- Step paragraphs that start with a bold numbered label (`**1. Forward** จากสูตร`, `**iter 2** Assign`) get 24 px space above and a 2 px `hairline` rule on the left of the step (no text change).
- Hover (hover-capable devices only): border turns `ink` (`fast`); no lift, no shadow.


### 5.4b Exercise card

- Marks a problem to solve alone. It must never be mistaken for a worked example, so it differs in surface and border: `soft-stone` fill, 1 px dashed border (`ink` at 40%), radius `md`, padding 20 (32 from `md` up), the solution is hidden until the card's own button is pressed.
- Header: the chip `PR 03` (coral outline, the running number in the page) and the title "แบบฝึกหัด N" in `type-feature-heading`; then the problem blocks (text, table, formulas, figure).
- The first exercise of a topic is preceded by a group label (a 1 px `ink` rule on top, "แบบฝึกหัด" in `type-feature-heading`, and the hint "ลองทำเองก่อน แล้วกดดูเฉลยเพื่อเทียบคำตอบ" in `body-muted`).
- Below the problem: an outline button "ดูเฉลย" / "ซ่อนเฉลย" with a plus/minus icon, `aria-expanded` and `aria-controls`. Each card opens and closes on its own (local state, closed on load). Open, it shows the Sol label, the steps and the Ans strip below a hairline rule. The solution is not in the DOM while closed.
- Order on a page: the theory of a topic, its examples (EX), then its exercises (PR). Exercises rise on scroll like example cards (A9).
- The contents rail lists them after the examples as `PR 03`; the heroes (Home and topic pages) count them beside the examples.

### 5.5 Block rendering

| Block | Rendering |
|---|---|
| `p` | `type-body`, line height 1.65 (Thai), `ink` |
| inline `math` | KaTeX HTML, 1.05 em |
| display `math` | Centered; `ScrollArea` wrapper (`overflow-x: auto`, keyboard stop only when it overflows); never wraps |
| `list` | Same type as `p`; markers `ink` |
| `table` | `research-table` chrome: centered, white, rows separated by `hairline` rules, a 1 px `ink` rule under the header row, header cells weight 500, row-header cells (`th` in a body row) weight 500 and left-aligned, padding 8 x 14, `tabular-nums`, alignment from the source, empty cells kept; inside a `ScrollArea` with a soft edge fade |
| `figure` | Inline SVG centered on a `card-border` frame (radius `md`, padding 16), `max-width: 100%`, `height: auto`, `currentColor` = `ink`; `role="img"` with the `aria-label` from the SVG |
| Sol label | Pill `Solⁿ` (`soft-stone`, radius `full`, `type-caption` 500), from the heading `Sol<sup>n</sup>` |
| Ans | Strip as in 5.4 |

### 5.6 Definitions page (`#/definitions`)

- A reference page built from `Definitions.md` (section 1 definitions, section 2 comparisons). It uses the same body as the topic pages: contents rail, section headers, `?s=` links, back to top.
- Hero: the light surface `soft-stone` with ink text, a mono tag "Definitions", the title, the lead and one count (topics). No colour band, no illustration, no `data-surface="dark"`.
- Navbar: a fourth tab "นิยาม" after the three topics, with a hollow dot (outline `ink`) instead of a colour dot; mobile menu: a fifth row numbered 04 with a hollow square, below a hairline.
- Home: an outline button "นิยามและการเปรียบเทียบ" under the numbers. The page is not in the diagram and not in the Home counts.
- Comparison tables are ordinary HTML tables (first column row headers); the wide one (four distances) scrolls sideways like any table.

## 6. Contents rail (topic pages)

Carried over from the NLP Notes rail, restyled.

### 6.1 Toggle (`RailToggle`)

- Icon only, 44 px circle, `primary` fill, `on-dark` icon; `aria-label` "เปิดสารบัญ" / "ปิดสารบัญ", `aria-expanded`, `aria-controls`. A list icon morphs into a cross (A12).
- Desktop: sticky in the page margin, outside the content and right-aligned to its edge (12 px gap); the content makes room only when the window margin is too small for it (about 1024 to 1250 px), keeping 8 px from the window edge. It stays when the rail is folded, and the body is then as wide as the hero. Tablet and phone: floating at bottom-left (16 px plus safe area).

### 6.2 Desktop rail (>= 1024)

- Grid `264 px | content`; the rail (248 px) is sticky at `top: 80px`, scrolls inside itself, open by default.
- Folding animates `grid-template-columns` (380 ms, ease-out); the content grows into the room. The folded rail is `inert` and `aria-hidden`.

### 6.3 Tree

| Level | Entry | Style |
|---|---|---|
| 1 section | `01  K-NN` (mono number, title), a 20 px progress ring | `type-button` 500 |
| 2 sub-topic or example | `1.1 Euclidean`, or the example title (`ตัวอย่างโจทย์ 1`) with its `EX` number | `type-caption`, indented 14 px with a `hairline` guide |
| 3 example inside a sub-topic | example title | `type-caption`, indented 28 px |

- The section that holds the reading position is expanded; inside it the sub-topic that holds it is expanded. Expansion follows scrolling (height animation 220 ms).
- Active entry (`aria-current="location"`): `soft-stone` fill, `ink` text 500, 3 px `ink` bar at the left; one highlight element slides between entries (A10). Entries show the mono number (`01`, `1.2`) or `EX 03`; a section runs from its own top to the top of the next section for its ring.
- Progress ring: track `hairline`, fill `ink`, clockwise; a finished section becomes a solid `deep-green` disc with an `on-dark` check.
- Entries are buttons that call `jumpTo(id)`.

### 6.4 Drawer (< 1024)

- From the left, `min(86vw, 340px)`, white, radius 22 on the right corners, over a scrim (`primary` at 40%, `backdrop-filter: blur(6px)`).
- Focus trap, `Esc`, scroll lock, closes on scrim press or entry choice; focus returns to the toggle (or goes to the target heading after a jump).

### 6.5 `jumpTo(id)` and `?s=`

Scrolls to the node (smooth, instant under reduced motion) with `scroll-margin-top` for the navbar, focuses its heading, plays the arrival underline (A13), and corrects its landing once the scroll ends (cards mounted late can shift it). Opening `#/<topic>?s=<node>` mounts every card first, then jumps.

## 7. Share

- Press the share button: if `navigator.share` exists and the device has a coarse pointer, call it with the page title and the current address. If it is cancelled nothing else happens; if it is missing or throws, open the dialog.
- **Share dialog** (`contact-form-card` look): centered white card, radius `lg` 22, padding 32 (24 phone), max width 420 px, over a blurred scrim; title "แชร์หน้านี้" (`type-feature-heading`), hint (`type-caption`, `body-muted`), the QR code (dark modules `ink` on white, quiet zone 4 modules, inside a `hairline` frame, radius `md`), and a link field (`soft-stone`, radius `sm`) with a `button-primary` icon button that copies (icon turns into a check for 1.8 s, live region "คัดลอกลิงก์แล้ว"). The cross, `Esc` or a press outside closes it; focus trapped and restored.
- The address shared is the current page (topic pages include `?s=` only when the user arrived with it).
- The QR encoder is `src/lib/qr.ts` from 1322201 (no dependency).

## 8. Responsive behavior

| Size class | Width | Navbar | Home | Topic pages |
|---|---|---|---|---|
| Small phone | < 425 | mark + "ML", share icon, hamburger | hero stacked, title 48 px, stats wrap 2 + 1 | one column, hero padding 32, cards padding 20, drawer |
| Phone | 425-767 | wordmark, share icon, hamburger | as above, title 60 px | as above |
| Phone landscape | up to 932 x 430 | 56 px high | diagram height follows content | floating buttons 44 px |
| Tablet | 768-1023 | tabs centered, share pill | hero stacked | reading width 880 px, drawer |
| Desktop | 1024-1439 | full | split hero | rail plus content |
| Wide | >= 1440 | full | content capped at 1200 px; wider empty space above and below sections (design's large intervals) | same cap |

Rules: no horizontal page scroll anywhere except inside the diagram canvas, tables, display math and figures; touch targets at least 44 px (40 px for rail rows); `100dvh` for full-height sheets; floating buttons respect `env(safe-area-inset-*)`; orientation change recomputes connectors, the rail highlight and the drawer width.

## 9. Animation

### Timing tokens

| Token | Value | Use |
|---|---|---|
| `fast` | 160 ms | colour, borders, exits |
| `base` | 240 ms | most transitions |
| `slow` | 480 ms | entrances |
| ease-out | `cubic-bezier(0.22, 1, 0.36, 1)` | entrances and slides |
| spring | stiffness 380, damping 30, as a CSS `linear()` curve with a cubic-bezier fallback (`--ease-spring`), 450 to 520 ms | drawer, share dialog, number pop, back-to-top |
| draw | `stroke-dashoffset` from path length to 0 | connectors, illustration lines, underline |

### Catalogue

| Id | Element | Trigger | Effect |
|---|---|---|---|
| A1 | Home title and lead | load | Title rises 24 px and fades from 30% opacity (never from 0, so it counts as painted for LCP); lead follows 80 ms later |
| A2 | Stat numbers (Home and topic heroes) | in view, once | Count up from 0 over 900 ms (`tabular-nums`); the final value is the DOM text |
| A3 | Home illustration | load, once (about 3.5 s) | Thin-line plot: 14 points pop in (stagger 40 ms); a fitted line draws through them (Regression); the points split into two groups with a dashed boundary (Classification); two coral centroids glide to their groups' centers (Clustering); settles in its final frame |
| A4 | Topic illustrations | hero in view, once | Regression: points appear, then the line draws and tilts from flat to its fitted slope, with residual ticks. Classification: two classes of points, a query point, a circle grows from it until it holds k points, the query takes the majority colour. Clustering: points start grey, two centroids appear, points take colours, centroids move to the means over two iterations |
| A5 | Diagram column open | node press | Column fades in and slides 16 px from the left (`base`), children staggered 40 ms; connectors draw in (300 ms); the coral end dot pops (spring) |
| A6 | Diagram column close | node press | Columns leave with a 160 ms fade and 8 px slide (leaving columns stay mounted until their exit ends) |
| A7 | Diagram root | press | The plus turns into a minus (`base`); the hint is removed at once (it sits in the flex row, so a fade would keep it in the layout) |
| A8 | Section header | in view, once | Top rule grows from the left (`scaleX`, 480 ms), then number and title fade up 12 px |
| A9 | Example card, topic card, overview panel | in view, once | Rise 20 px and fade (`slow`), staggered 40 ms for blocks that arrive together (max 4) |
| A20 | Blocks of a part (paragraph, formula, table, list, figure) in sections, sub-topics, the overview and inside example and exercise cards | each block in view, once | Rises 14 px and fades (420 ms, ease-out), one block at a time, staggered 40 ms for blocks that arrive together (max 4); blocks already above the window after a jump appear at once; no `will-change`, so hundreds of waiting blocks cost no layers |
| A10 | Rail highlight and tree | scroll | Highlight slides to the active entry (300 ms); the active section expands (`base`); ring sweeps |
| A11 | Rail fold (desktop) | toggle | Grid columns animate (380 ms); rail slides out with a fade |
| A12 | Rail toggle icon | toggle | List morphs into a cross (240 ms) |
| A13 | Jump arrival | after `jumpTo` | A 3 px `coral` underline with a 1 px `ink` outline draws left to right under the target heading and fades out (1.8 s) |
| A14 | Reading progress | scroll | 2 px `coral` line under the navbar, `scaleX` from the left |
| A15 | Hamburger and mobile menu | toggle | Icon morphs into a cross; the sheet fades in and the rows rise 12 px, staggered 30 ms |
| A16 | Drawer | toggle | Springs in from the left (520 ms); scrim fades in; entries rise together after 120 ms |
| A17 | Share dialog | open | Scrim fades and blurs in; the card scales from 0.96 to 1 with the spring; the QR modules fade in; copy icon cross-fades to a check |
| A18 | Back-to-top | after the first screen | Fades and scales in (spring); a coral ring tracks the page progress |
| A19 | Navbar | scroll over 8 px | Hairline rule fades in (`fast`) |
| A20 | Skeleton and toast | loading, update | Skeleton bars pulse in opacity; toast slides up 16 px and fades (`base`) |

### Rules

- Only `transform` and `opacity` animate, with three exceptions: the rail tree expansion (height), the rail column width on desktop (A11), and SVG `stroke-dashoffset` (A3 to A5, A13). Never anything that shifts content the reader is looking at.
- Reveals (A8, A9) share one IntersectionObserver (`rootMargin` 10% at the bottom), play once, then stop observing. A block already above the window renders in its final state.
- Scroll-driven values (A10, A14, A18, A19) come from one `requestAnimationFrame`-throttled scroll handler.
- Illustrations are inline SVG built in code from fixed coordinates (no course data), decorative and `aria-hidden`; they run once and stop; they pause when the tab is hidden.
- **`prefers-reduced-motion: reduce`:** every entrance renders its final state; counts show the final number; illustrations show their final frame; the diagram opens and closes instantly; the highlight jumps; the rail, drawer, menu and dialog appear instantly (scrims may fade); jumps scroll instantly. Progress values still update (state, not motion).
- **No animation library.** CSS keyframes, transitions and `linear()` springs, plus the Web Animations API for measured moves (the rail tree fold, leaving diagram columns). Keyframes and curves live in `src/styles/motion.css`.

## 10. Loading, empty and error states

- First paint: navbar, the hero (static text from `src/config/site.ts` and the small `generated/meta.json`), then a skeleton (three `soft-stone` bars, radius 16) where content will come, `aria-busy` on the article.
- Long pages mount their cards in small batches after first paint; unmounted cards are placeholders with the right id, so anchors and the rail always work.
- A failed content chunk shows "โหลดเนื้อหาไม่สำเร็จ" with a `button-primary` "ลองอีกครั้ง".
- Not found: centered, "404" in `type-section-display`, "ไม่พบหน้านี้" in `type-section-heading`, `button-primary` "กลับหน้าหลัก".

## 11. Brand mark and icons

- **Mark:** three data points on a rising fitted line, the last point coral. Geometry on a 32 x 32 grid: line `M4 25 L28 7` (2 px, `ink`, round caps); points: circle (8, 21) r 2.75 and circle (16, 15) r 2.75 with `ink` 2 px stroke and white fill, circle (24.5, 9.5) r 3.25 filled `coral` with an `ink` 1.5 px stroke.
- Wordmark: "ML" Space Grotesk 500 `ink`, "Notes" Space Grotesk 400 `body-muted`.
- Favicon: the mark on a `soft-stone` rounded tile (SVG plus PNG fallback). PWA icons 192, 512 and maskable 512 (mark inside the 80% safe zone), Apple touch icon 180, drawn from the same geometry by `scripts/make-icons.py`.
- Theme color `canvas`; manifest background `soft-stone`.
- Never use the design source's name, logo, copy, photography or illustrations, the Anthropic mark, or the word "Claude".

## 12. Accessibility pairings (contrast measured with the WCAG formula)

| Foreground / background | Contrast | Allowed for |
|---|---|---|
| `ink` / `canvas` | 16.1:1 | everything |
| `primary` / `canvas` | 17.9:1 | everything |
| `ink` / `soft-stone` | 13.6:1 | text in stone panels and cards |
| `ink` / `pale-green` | 15.1:1 | Ans strip |
| `body-muted` / `canvas` | 6.2:1 | secondary text |
| `body-muted` / `soft-stone` | 5.2:1 | secondary text on stone |
| `action-blue` / `canvas` | 5.4:1 | content links |
| `on-dark` / `deep-green` | 12.4:1 | Classification band, Home illustration card |
| `on-dark` / `dark-navy` | 17.9:1 | Regression band |
| `on-dark` / `primary` | 17.9:1 | Clustering band, pills, toggle, toast |
| `coral` / `primary`, `dark-navy`, `deep-green` | 6.8, 6.9, 4.7:1 | text and accents on dark |
| `focus-blue` / `canvas` | 4.5:1 | focus ring (non-text, needs 3:1) |
| `deep-green` / `pale-green` | 11.6:1 | Ans bar (non-text) |
| `coral` / `canvas` | 2.6:1 | **decoration only, always beside an `ink` cue** |
| `muted` / `canvas` | 3.0:1 | **no text**; decorative strokes |
| `slate` / `canvas` | 4.5:1 (edge) | **no text**; use `body-muted` |
| `hairline` / `canvas` | 1.4:1 | rules only (never the only boundary of a control) |

Other rules: every icon-only control has an accessible name; heading order is `h1` (page) then `h2` (section) then `h3` (sub-topic or example) then `h4` (example inside a sub-topic); the Sol heading of the Markdown is rendered as a label, not a heading, so the outline stays clean; the diagram blocks use `h2` inside their region; figures keep their `aria-label`.

## 13. Definition of done for any component

1. Matches this spec and the tokens in `DESIGN-cohere.md`.
2. Works at 360, 390, 768, 1024, 1440 widths and phone landscape.
3. Keyboard operable, correct focus order, visible focus.
4. Respects `prefers-reduced-motion` (section 9 rules).
5. No overlap, no horizontal page scroll, no clipped math, Thai tone marks not clipped.
6. Passes the pairings in section 12.
7. Covered by the checks in `TESTING.md`.
