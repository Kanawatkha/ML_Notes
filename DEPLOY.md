# DEPLOY

How the site is built, hosted and updated. Everything runs on GitHub: no external service, no secrets.

## 1. Target

- Host: GitHub Pages for repository `Kanawatkha/ML_Notes` (public).
- URL: `https://kanawatkha.github.io/ML_Notes/`
- Deployment: a GitHub Actions workflow publishes the Vite `dist/` folder as the Pages artifact. `dist/` is never committed.
- The repository also holds `docs/` (lecturer slides, notebooks and Python files) and the planning documents. They are not part of the build. The owner decided that `docs/` stays public (decision O1 in `PLAN.md`).

## 2. One-time repository setup (user action)

1. GitHub, repository **Settings, Pages**.
2. **Build and deployment, Source: GitHub Actions.**
3. Confirm the default branch is `main`.

## 3. Vite and router settings

| Setting | Value | Why |
|---|---|---|
| `base` | `'/ML_Notes/'` for build and preview, `'/'` for dev | Pages serves under the repository name |
| Router | `HashRouter` | Deep links (`#/classification?s=1.2`) work without server rewrites |
| Asset URLs | through Vite imports or `import.meta.env.BASE_URL` | No hard-coded absolute paths |
| `public/` files | referenced with `BASE_URL` | Same reason |

The repository name lives in one constant, `REPO_NAME` in `src/config/site.ts`, read by `vite.config.ts` too.

## 4. Workflows

### `ci.yml` (push to branches other than `main`, and pull requests)

Checkout, `actions/setup-node` (version from `.nvmrc`, 24, npm cache), `npm ci`, `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm run test`, `npm run build`.

### `deploy.yml` (push to `main`, and manual dispatch)

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Pin action versions to the current stable majors at implementation time (copy them from the reference projects' working workflows).

## 5. Build pipeline

`npm run build` = content generation, type check, Vite build. A failure in any step stops the deploy: bad KaTeX, a bad table or SVG, an unknown construct, a failed round trip, a type error or a lint error means nothing is published. This is the safety net for the "edit Markdown and push" workflow.

## 6. Offline and PWA

- `vite-plugin-pwa`, `generateSW`, `registerType: 'prompt'`. `ToastHost` checks for a new worker every minute and when the tab regains focus, applies it and reloads by itself; the toast "มีเวอร์ชันใหม่ พร้อมใช้งาน" with "โหลดใหม่" is the backup.
- `version.json` (emitted by the build, never cached) carries the build id compiled into the page. `src/app/pwa/versionCheck.ts` compares them on open, on return to the screen, when the network comes back and every minute; a mismatch unregisters the worker, clears all caches and reloads (at most 3 times in 5 minutes). Carried over from both references.
- Precache (`globPatterns` html, js, css, json, woff2, svg, png, webmanifest): the page, JS, CSS, the generated chunks, KaTeX CSS and fonts, Space Grotesk, Inter, IBM Plex Mono and IBM Plex Sans Thai files, icons. `version.json` is excluded. `maximumFileSizeToCacheInBytes` 4 MiB.
- Manifest (`src/config/pwa.ts`): `name` and `short_name` "ML Notes", `lang: th`, `display: standalone`, `start_url` and `scope` = base path, `theme_color` `canvas` (#ffffff), `background_color` `soft-stone` (#eeece7), icons 192, 512 and maskable 512, Apple touch icon 180, SVG favicon. `tests/pwa.test.ts` checks the colours against `DESIGN-cohere.md`.
- Icons are drawn from the logo geometry by `scripts/make-icons.py` (`npm run icons`, needs PyMuPDF); the PNGs are committed, so CI needs no Python.
- Navigation fallback is `index.html`.
- Projects served from the same `localhost` port share one origin; unregister other projects' workers in DevTools before a manual test, or use another port.

## 7. Editing workflow after launch

1. Edit a file in `content/midterm/` (load the `edit-content` and `verify-math` skills first).
2. `npm run dev` to see it (optional).
3. Commit and push to `main` (only when the user asks).
4. CI builds, tests and deploys within a few minutes. Returning visitors get the new version automatically.

## 8. Fonts and licensing

- All fonts are SIL Open Font License and self-hosted through npm packages (`@fontsource/space-grotesk`, `@fontsource-variable/inter`, `@fontsource/ibm-plex-mono`, `@fontsource/ibm-plex-sans-thai`), so no request leaves GitHub Pages.
- Only used weights and subsets are imported: Space Grotesk 400/500 Latin, Inter variable Latin, IBM Plex Mono 400/500 Latin, IBM Plex Sans Thai 400/500/600 Thai.
- KaTeX is MIT. The logo is original. Nothing from the design source's brand is shipped.

## 9. Rollback and troubleshooting

| Symptom | Likely cause | Action |
|---|---|---|
| Blank page, 404 for JS/CSS | Wrong `base` | Check `vite.config.ts` and `site.ts` |
| Works locally, fails on Pages | Absolute asset paths | Use `BASE_URL` helpers |
| Old content after deploy | Service worker still serving the old version | Wait a minute or press "โหลดใหม่"; the version check reloads by itself |
| Deploy not triggered | Pages source not set to GitHub Actions | Fix in repository settings |
| Build fails in CI only | Node version or lockfile drift | `.nvmrc`, `npm ci`, commit the lockfile |

Rollback: revert the commit on `main` (or re-run an earlier successful workflow). The next deployment replaces the live site.
