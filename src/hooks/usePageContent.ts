import { useEffect, useState } from 'react';
import type { ContentPageId } from '@/config/site';
import { loadMeta, loadPage } from '@/content/loaders';
import type { PageFile, PageMeta } from '@/content/types';

export type LoadState<T> =
  { status: 'loading' } | { status: 'error'; retry: () => void } | { status: 'ready'; data: T };

type Result<T> = { id: string; data?: T; failed?: boolean };

/** Loads something lazily for a page. Shows loading until the data for `id` has arrived. */
function useLazy<T>(
  id: ContentPageId,
  load: (id: ContentPageId) => Promise<T>,
  enabled: boolean,
): LoadState<T> {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<Result<T>>({ id: '' });

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    load(id)
      .then((data) => {
        if (!cancelled) setResult({ id, data });
      })
      .catch(() => {
        if (!cancelled) setResult({ id, failed: true });
      });
    return () => {
      cancelled = true;
    };
  }, [id, load, enabled, attempt]);

  if (result.id !== id) return { status: 'loading' };
  if (result.failed || result.data === undefined) {
    return {
      status: 'error',
      retry: () => {
        setResult({ id: '' });
        setAttempt((n) => n + 1);
      },
    };
  }
  return { status: 'ready', data: result.data };
}

async function loadPageMeta(id: ContentPageId): Promise<PageMeta> {
  const meta = (await loadMeta())[id];
  if (!meta) throw new Error(`No meta for "${id}"`);
  return meta;
}

/** The small file with the title, lead and stats, for the hero. */
export function usePageMeta(id: ContentPageId): LoadState<PageMeta> {
  return useLazy(id, loadPageMeta, true);
}

/** The big content file. Pass `enabled` false to hold it back, for example until the hero is painted. */
export function usePageContent(id: ContentPageId, enabled = true): LoadState<PageFile> {
  return useLazy(id, loadPage, enabled);
}
