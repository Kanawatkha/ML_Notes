import { resolve } from 'node:path';
import { buildContent } from '../../scripts/build-content/index.ts';
import { EXTRA_PAGES, PAGES, type ContentPageId } from '@/config/site';
import type { HomeFile, PageFile, PageMeta } from '@/content/types';

/** The real content of the three Markdown files, converted once per test file (not read from `generated/`). */
const built = buildContent(resolve(__dirname, '../..'), PAGES, EXTRA_PAGES);

if (built.errors.length > 0) throw new Error(built.errors.join('\n'));

export const counts = Object.fromEntries(
  [...built.pages, ...built.extra].map((p) => [p.file.id, p.counts]),
);

export function fileOf(id: ContentPageId): PageFile {
  const page = [...built.pages, ...built.extra].find((p) => p.file.id === id);
  if (!page) throw new Error(`no page ${id}`);
  return page.file;
}

export const homeFile: HomeFile = built.home;

export const metaMap: Record<string, PageMeta> = built.meta;
