import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { INCLUDE_ASSETS, MANIFEST } from './src/config/pwa.ts';
import { REPO_NAME } from './src/config/site.ts';

/** KaTeX ships woff2, woff and ttf for every font. Browsers we support all take woff2, so drop the rest. */
function katexWoff2Only(): Plugin {
  const legacy = /,url\([^)]*\.woff\) format\("woff"\),url\([^)]*\.ttf\) format\("truetype"\)/g;
  return {
    name: 'katex-woff2-only',
    enforce: 'pre',
    transform(code, id) {
      if (!/katex[\\/]dist[\\/]katex(-swap)?\.min\.css/.test(id)) return null;
      return { code: code.replace(legacy, ''), map: null };
    },
  };
}

/**
 * Preloads what the first paint needs, so the browser does not find it one step at a time:
 * the fonts of the first screen (Latin body, display and Thai body and bold; a late Thai face
 * reflowed the text and caused a layout shift) and the small shared chunks of the route components
 * and the hero data. The big page content chunks are left out on purpose: the page paints its hero
 * first and loads them afterwards.
 */
function preloadFirstPaint(): Plugin {
  const fonts =
    /(ibm-plex-sans-thai-thai-(400|500)|inter-latin-wght|space-grotesk-latin-400)-normal.*\.woff2$/;
  const chunks = /assets\/(HomePage|TopicPage|BlockRenderer|usePageTitle|meta|home)-[\w-]+\.js$/;
  return {
    name: 'preload-first-paint',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        if (!ctx.bundle) return;
        const names = Object.keys(ctx.bundle);
        return [
          ...names
            .filter((name) => fonts.test(name))
            .map((name) => ({
              tag: 'link',
              injectTo: 'head' as const,
              attrs: {
                rel: 'preload',
                as: 'font',
                type: 'font/woff2',
                crossorigin: '',
                href: `/${REPO_NAME}/${name}`,
              },
            })),
          ...names
            .filter((name) => chunks.test(name))
            .map((name) => ({
              tag: 'link',
              injectTo: 'head' as const,
              attrs: { rel: 'modulepreload', crossorigin: '', href: `/${REPO_NAME}/${name}` },
            })),
        ];
      },
    },
  };
}

/** One id per build; the page carries it and `version.json` publishes it (see src/app/pwa/versionCheck.ts). */
const BUILD_ID = String(Date.now());

/** Publishes `version.json`, which pages compare with their own build id to find out they are old. */
function versionFile(): Plugin {
  return {
    name: 'version-file',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'version.json',
        source: JSON.stringify({ id: BUILD_ID }),
      });
    },
  };
}

export default defineConfig(({ command, isPreview }) => ({
  define: { __BUILD_ID__: JSON.stringify(BUILD_ID) },
  // GitHub Pages serves the site under /<repo name>/. The dev server uses the root;
  // preview mirrors production so the real base path can be tested locally.
  base: command === 'build' || isPreview ? `/${REPO_NAME}/` : '/',
  plugins: [
    katexWoff2Only(),
    preloadFirstPaint(),
    versionFile(),
    react(),
    tailwindcss(),
    // Precaches the whole build so the site works offline. A new version is applied by the toast
    // host (src/app/pwa/ToastHost.tsx) and by the version check.
    VitePWA({
      registerType: 'prompt',
      includeAssets: INCLUDE_ASSETS,
      manifest: MANIFEST,
      workbox: {
        // json is left out on purpose: version.json must always come from the network
        globPatterns: ['**/*.{html,js,css,woff2,svg,png,webmanifest}'],
        // each page is one chunk; a file over the limit would silently stay out of the cache
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  // Each page is one pre-rendered JSON chunk: up to 1.5 MB raw but 67 KB gzip, which is what the
  // budget in TESTING.md measures. The default 500 KB warning would always fire.
  build: { chunkSizeWarningLimit: 1600 },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // vite-plugin-pwa makes this module at build time; tests get a stand-in
      ...(process.env.VITEST
        ? {
            'virtual:pwa-register/react': fileURLToPath(
              new URL('./src/test/pwaRegisterStub.ts', import.meta.url),
            ),
          }
        : {}),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'tests/**/*.test.{ts,tsx}'],
    testTimeout: 20000,
  },
}));
