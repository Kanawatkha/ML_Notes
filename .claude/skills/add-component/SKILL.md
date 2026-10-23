---
name: add-component
description: Add or change a React component, hook, page or feature in the ML Notes app following the project's folder structure, import boundaries, Cohere design tokens, animation rules, accessibility and testing rules. Use when creating or modifying anything under src/, including the home diagram, topic pages, rail, share dialog and illustrations.
---

# add-component

Follow `ARCHITECTURE.md` for structure, `UI-SPEC.md` for behavior and animation, `DESIGN-cohere.md` for tokens, `AGENTS.md` for style.

## Checklist

1. **Look for it in the reference projects first.** The diagram, share dialog, QR code, navbar and mobile menu come from 1322201; the rail, drawer, progress, back-to-top, reveals and count-up come from NLP Notes (`ARCHITECTURE.md` section 3). Copy, then adapt; never import across repositories or edit them.
2. **Place it correctly.**
   - Generic, no course knowledge: `src/components/ui/`, `layout/`, `motion/` or `content/`.
   - One feature: `src/features/<home | home-diagram | topic>/`.
   - A route: `src/pages/<Name>Page.tsx`, lazy-loaded, listed in `src/config/site.ts`.
   - Generic hook: `src/hooks/`. Pure helper: `src/lib/`.
3. **Respect import direction.** `pages -> features -> components -> hooks/lib/content/config`. A feature never imports another feature. Use the `@/` alias.
4. **Type it.** Strict TypeScript, explicit props type, no `any`. Components take typed content (`Block`, `ContentNode`, `PageFile`) and never raw Markdown or hard-coded course text. UI strings come from `UI_TEXT`.
5. **Style with tokens.** Utilities that reference the `@theme` tokens. No inline hex, no magic pixels that duplicate a token. Coral is a rare marker and never text on white; muted and slate are never text on white; topic colours appear only in their bands, swatches and illustrations. Flat: no card shadows.
6. **Type rules.** Display utilities (`type-hero`, `type-product`, `type-section-display`) only for Latin-only text. Anything that may hold Thai uses `type-section-heading` or smaller with the Thai line heights.
7. **Make it accessible.** Semantic elements first; disclosures expose `aria-expanded` and `aria-controls`; visible focus ring (`focus-blue`, or `on-dark` on bands); `Esc` closes transient UI and restores focus; decorative SVG is `aria-hidden`; icon-only buttons have names.
8. **Animate within the rules.** Transform and opacity only (plus the three listed exceptions); reveals through the shared observer (`useReveal`); scroll values through `useScrollProgress`; keyframes in `styles/motion.css`; a reduced-motion final state for everything; no animation library.
9. **Make it responsive.** 360, 390, 768, 1024, 1440 and phone landscape. No horizontal page scroll; wide math, tables, figures and the diagram scroll inside their own wrapper.
10. **Keep it small.** One component per file, named export, file name equals component name. Data shaping goes to `lib/` or `content/stats.ts`.
11. **Test it.** A Vitest test next to the file for logic and each variant; axe on new interactive UI.
12. **Update docs.** If behavior or structure changed, update `UI-SPEC.md` or `ARCHITECTURE.md` in the same change.
13. **Run the gates.** `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build`.

## Anti-patterns

- Hard-coding Thai course text in a component.
- Parsing Markdown or running KaTeX in the browser.
- Absolute positioning for diagram blocks (flow layout; only the connector layer is absolute).
- Coral, muted or slate text on white; gradients as UI fills; drop shadows on cards.
- Adding a dependency without asking.

## Component template

```tsx
import type { Block } from '@/content/types';
import { BlockRenderer } from '@/components/content/BlockRenderer';

type AnsStripProps = { blocks: Block[] };

export function AnsStrip({ blocks }: AnsStripProps) {
  return (
    <div className="rounded-sm border-l-[3px] border-deep-green bg-pale-green px-5 py-4">
      <BlockRenderer blocks={blocks} />
    </div>
  );
}
```
