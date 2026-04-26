'use client';

import { useUnit } from 'effector-react';
import { useEffect } from 'react';

import { $hydrated, cartHydrated, cartItemsReplaced, type CartItem } from './model';

const STORAGE_KEY = 'mvst_cart_v1';

export function useHydrateCart() {
  // bind through useUnit so events fire on the current @effector/next scope —
  // calling the raw imported event would mutate the un-scoped global store
  // and the per-request scoped store would stay empty (cart appears reset
  // every page load / new tab even though localStorage is populated)
  const [hydrated, hydrate, replace] = useUnit([
    $hydrated,
    cartHydrated,
    cartItemsReplaced,
  ]);

  useEffect(() => {
    if (!hydrated) hydrate();
  }, [hydrated, hydrate]);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== STORAGE_KEY) return;
      try {
        const next = e.newValue ? (JSON.parse(e.newValue) as CartItem[]) : [];
        if (Array.isArray(next)) replace(next);
      } catch {
        /* ignore */
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [replace]);
}
