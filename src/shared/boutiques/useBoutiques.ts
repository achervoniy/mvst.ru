'use client';

import { useEffect, useState } from 'react';

import type { Boutique } from './data';

let cache: Boutique[] | null = null;
let inflight: Promise<Boutique[]> | null = null;

async function load(): Promise<Boutique[]> {
  if (cache) return cache;
  if (inflight) return inflight;
  inflight = (async () => {
    try {
      const res = await fetch('/api/boutiques', { cache: 'no-store' });
      if (!res.ok) return [];
      const data = (await res.json()) as { boutiques: Boutique[] };
      cache = data.boutiques ?? [];
      return cache;
    } catch {
      return [];
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

export function useBoutiques(): { boutiques: Boutique[]; loading: boolean } {
  const [boutiques, setBoutiques] = useState<Boutique[]>(cache ?? []);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    let alive = true;
    load().then(list => {
      if (!alive) return;
      setBoutiques(list);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  return { boutiques, loading };
}
