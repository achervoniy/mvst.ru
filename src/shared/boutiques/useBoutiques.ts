'use client';

import { useEffect, useState } from 'react';

import type { Boutique } from './data';

// Дедупим только параллельные запросы в пределах одного пейнта — постоянный
// кэш держать не хочется, иначе после правки в админке SPA-навигация
// продолжает показывать старое до полной перезагрузки вкладки.
let inflight: Promise<Boutique[]> | null = null;

async function load(): Promise<Boutique[]> {
  if (inflight) return inflight;
  inflight = (async () => {
    try {
      const res = await fetch('/api/boutiques', { cache: 'no-store' });
      if (!res.ok) return [];
      const data = (await res.json()) as { boutiques: Boutique[] };
      return data.boutiques ?? [];
    } catch {
      return [];
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

export function useBoutiques(): { boutiques: Boutique[]; loading: boolean } {
  const [boutiques, setBoutiques] = useState<Boutique[]>([]);
  const [loading, setLoading] = useState(true);

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
