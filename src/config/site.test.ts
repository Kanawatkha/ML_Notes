import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CHEATSHEET_PAGE, PAGES, REFERENCE_PAGE, REPO_NAME, SITE_NAME } from './site';

describe('site config', () => {
  it('uses the GitHub repository name for the Pages base path', () => {
    expect(REPO_NAME).toBe('ML_Notes');
    expect(SITE_NAME).toBe('ML Notes');
  });

  it('declares the three topic pages', () => {
    expect(PAGES.map((p) => p.id)).toEqual(['regression', 'classification', 'clustering']);
  });

  it('declares the definitions page apart from the topics, with its own route and source', () => {
    expect(PAGES.map((p) => p.id)).not.toContain(REFERENCE_PAGE.id);
    expect(PAGES.map((p) => p.route)).not.toContain(REFERENCE_PAGE.route);
    expect(existsSync(resolve(__dirname, '../..', REFERENCE_PAGE.source))).toBe(true);
  });

  it('declares the cheat sheet apart from the topics, with its own route and source', () => {
    expect(PAGES.map((p) => p.id)).not.toContain(CHEATSHEET_PAGE.id);
    expect(CHEATSHEET_PAGE.route).not.toBe(REFERENCE_PAGE.route);
    expect(existsSync(resolve(__dirname, '../..', CHEATSHEET_PAGE.source))).toBe(true);
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
