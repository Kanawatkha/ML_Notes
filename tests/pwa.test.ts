// @vitest-environment node
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { INCLUDE_ASSETS, MANIFEST } from '../src/config/pwa';
import { SITE_NAME } from '../src/config/site';

const root = process.cwd();

/** Width and height from the header of a PNG file. */
function pngSize(path: string): [number, number] {
  const buf = readFileSync(path);
  if (buf.toString('latin1', 1, 4) !== 'PNG') throw new Error(`${path} is not a PNG`);
  return [buf.readUInt32BE(16), buf.readUInt32BE(20)];
}

function designColor(name: string): string {
  const design = readFileSync(join(root, 'DESIGN-cohere.md'), 'utf8');
  const m = new RegExp(`^ {2}${name}: "(#[0-9a-fA-F]{6})"`, 'm').exec(design);
  if (!m) throw new Error(`no color ${name} in DESIGN-cohere.md`);
  return m[1];
}

describe('web app manifest', () => {
  it('names the app and opens it as a standalone Thai-language app', () => {
    expect(MANIFEST.name).toBe(SITE_NAME);
    expect(MANIFEST.short_name).toBe(SITE_NAME);
    expect(MANIFEST.display).toBe('standalone');
    expect(MANIFEST.lang).toBe('th');
  });

  it('uses the design colors: canvas for the theme, soft-stone behind the splash', () => {
    expect(MANIFEST.theme_color).toBe(designColor('canvas'));
    expect(MANIFEST.background_color).toBe(designColor('soft-stone'));
  });

  it('has a 192, a 512 and a maskable 512 icon, and each file exists with its stated size', () => {
    const sizes = MANIFEST.icons.map((i) => i.sizes);
    expect(sizes).toEqual(['192x192', '512x512', '512x512']);
    expect(MANIFEST.icons.filter((i) => 'purpose' in i).map((i) => i.src)).toEqual([
      'icons/icon-maskable-512.png',
    ]);
    for (const icon of MANIFEST.icons) {
      const [w, h] = icon.sizes.split('x').map(Number);
      expect(pngSize(join(root, 'public', icon.src)), icon.src).toEqual([w, h]);
    }
  });

  it('precaches the favicon and the Apple touch icon, which exist', () => {
    for (const file of INCLUDE_ASSETS)
      expect(existsSync(join(root, 'public', file)), file).toBe(true);
    expect(pngSize(join(root, 'public/icons/apple-touch-icon.png'))).toEqual([180, 180]);
  });

  it('is linked from the page with the same theme color and the touch icon', () => {
    const html = readFileSync(join(root, 'index.html'), 'utf8');
    expect(html).toContain(`<meta name="theme-color" content="${MANIFEST.theme_color}"`);
    expect(html).toContain('rel="apple-touch-icon"');
  });
});

describe('service worker setup', () => {
  const config = readFileSync(join(root, 'vite.config.ts'), 'utf8');

  it('asks before updating (the toast host applies it) and caches the whole build', () => {
    expect(config).toContain("registerType: 'prompt'");
    expect(config).toContain("globPatterns: ['**/*.{html,js,css,woff2,svg,png,webmanifest}']");
  });

  it('keeps version.json out of the cache, since it must always come from the network', () => {
    expect(config).not.toMatch(/globPatterns:[^\]]*json/);
    expect(config).toContain("fileName: 'version.json'");
  });

  it('allows the biggest page chunk into the cache', () => {
    expect(config).toContain('maximumFileSizeToCacheInBytes: 4 * 1024 * 1024');
  });
});
