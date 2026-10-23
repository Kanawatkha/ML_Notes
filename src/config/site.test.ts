import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { PAGES, REPO_NAME, SITE_NAME } from './site';

describe('site config', () => {
  it('uses the GitHub repository name for the Pages base path', () => {
    expect(REPO_NAME).toBe('ML_Notes');
    expect(SITE_NAME).toBe('ML Notes');
  });

  it('declares the three topic pages', () => {
    expect(PAGES.map((p) => p.id)).toEqual(['regression', 'classification', 'clustering']);
  });

  it('gives every page a unique route and an existing Markdown source', () => {
    const routes = PAGES.map((p) => p.route);
    expect(new Set(routes).size).toBe(routes.length);
    for (const page of PAGES) {
      expect(page.route.startsWith('/')).toBe(true);
      expect(existsSync(resolve(__dirname, '../..', page.source))).toBe(true);
    }
  });
});
