import { useEffect, useState } from 'react';
import { loadHome } from '@/content/loaders';
import type { HomeFile } from '@/content/types';

/** The small home file (outline and counts of every page). `null` until it has arrived or if it failed. */
export function useHome(): HomeFile | null {
  const [home, setHome] = useState<HomeFile | null>(null);
  useEffect(() => {
    let cancelled = false;
    loadHome()
      .then((h) => {
        if (!cancelled) setHome(h);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  return home;
}
