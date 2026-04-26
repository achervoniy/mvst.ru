'use client';

import { useUnit } from 'effector-react';
import { useEffect } from 'react';

import { $hydrated, cartHydrated, cartItemsReplaced, type CartItem } from './model';

const STORAGE_KEY = 'mvst_cart_v1';

export function useHydrateCart() {
  const hydrated = useUnit($hydrated);

  useEffect(() => {
    if (!hydrated) cartHydrated();
  }, [hydrated]);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== STORAGE_KEY) return;
      try {
        const next = e.newValue ? (JSON.parse(e.newValue) as CartItem[]) : [];
        if (Array.isArray(next)) cartItemsReplaced(next);
      } catch {
        /* ignore */
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
}
