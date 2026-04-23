'use client';

import { useUnit } from 'effector-react';
import { useEffect } from 'react';

import { $hydrated, cartHydrated } from './model';

/** Один раз подтягивает корзину из sessionStorage. Идемпотентен — повторные монтирования no-op. */
export function useHydrateCart() {
  const hydrated = useUnit($hydrated);
  useEffect(() => {
    if (!hydrated) cartHydrated();
  }, [hydrated]);
}
