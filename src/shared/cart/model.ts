import { createEffect, createEvent, createStore, sample } from 'effector';

import type { RecentItem } from '@/rootPages/ProductPage/parts/useRecentlyViewed';

export type CartItem = {
  key: string; // productId + offerId
  productId: number;
  slug: string;
  title: string;
  brand: string;
  color?: string;
  image?: string;
  offerId: number;
  sizeLabel: string;
  price: number;
  priceOriginal: number;
  qty: number;
};

const STORAGE_KEY = 'mvst_cart_v1';

function readStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY) ?? window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStorage(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* quota or unavailable */
  }
}

/* ── события ── */

export const cartHydrated = createEvent();
export const cartItemsReplaced = createEvent<CartItem[]>();
export const cartOpened = createEvent<{ step?: CartStep } | void>();
export const cartClosed = createEvent();
export const cartStepSet = createEvent<CartStep>();

export const addToCart = createEvent<Omit<CartItem, 'key' | 'qty'>>();
export const removeFromCart = createEvent<string>();
export const clearCart = createEvent();

export const boutiqueSelected = createEvent<string>();
export const contactNameChanged = createEvent<string>();
export const contactPhoneChanged = createEvent<string>();
export const requestSubmitted = createEvent();
export const requestReset = createEvent();
export const requestError = createEvent<string | null>();

export type CartStep = 'items' | 'boutique' | 'contacts' | 'done';

/* ── сторы ── */

export const $items = createStore<CartItem[]>([]);
export const $isOpen = createStore(false);
export const $step = createStore<CartStep>('items');
export const $hydrated = createStore(false);

export const $selectedBoutiqueId = createStore<string | null>(null);
export const $contactName = createStore('');
export const $contactPhone = createStore('');

/* ── редьюсеры ── */

$items
  .on(cartHydrated, () => readStorage())
  .on(cartItemsReplaced, (_, next) => next)
  .on(addToCart, (items, payload) => {
    const key = `${payload.productId}_${payload.offerId}`;
    const existing = items.find(i => i.key === key);
    if (existing) {
      return items.map(i => (i.key === key ? { ...i, qty: i.qty + 1 } : i));
    }
    return [...items, { ...payload, key, qty: 1 }];
  })
  .on(removeFromCart, (items, key) => items.filter(i => i.key !== key))
  .reset(clearCart);

$hydrated.on(cartHydrated, () => true);

$isOpen
  .on(cartOpened, () => true)
  .on(cartClosed, () => false);

$step
  .on(cartStepSet, (_, s) => s)
  .on(cartOpened, (prev, payload) => (payload && payload.step ? payload.step : prev))
  .on(cartClosed, () => 'items')
  .on(clearCart, () => 'items')
  .on(requestReset, () => 'items');

$selectedBoutiqueId.on(boutiqueSelected, (_, id) => id).reset(clearCart, requestReset);
$contactName.on(contactNameChanged, (_, v) => v).reset(clearCart, requestReset);
$contactPhone.on(contactPhoneChanged, (_, v) => v).reset(clearCart, requestReset);

/* persist → sessionStorage */
const persistFx = createEffect<CartItem[], void>(items => writeStorage(items));
sample({
  clock: [addToCart, removeFromCart, clearCart],
  source: $items,
  target: persistFx,
});

/* итоги */
export const $count = $items.map(items => items.reduce((sum, i) => sum + i.qty, 0));
export const $total = $items.map(items => items.reduce((sum, i) => sum + i.price * i.qty, 0));

/* ── submit запроса на примерку ── */

export const $requestError = createStore<string | null>(null)
  .on(requestError, (_, e) => e)
  .reset(requestReset, cartClosed);

export const $requestPending = createStore(false);

type SubmitPayload = {
  boutiqueSlug: string;
  name: string;
  phone: string;
  items: CartItem[];
  recentlyViewed: RecentItem[];
  submittedAt: string;
};

const submitFittingRequestFx = createEffect<SubmitPayload, void, Error>(async (payload) => {
  const res = await fetch('/api/fitting-request', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error ?? `HTTP ${res.status}`);
  }
});

sample({
  clock: requestSubmitted,
  source: { items: $items, boutiqueSlug: $selectedBoutiqueId, name: $contactName, phone: $contactPhone },
  filter: ({ boutiqueSlug, name, phone, items }) =>
    !!boutiqueSlug && name.length >= 2 && phone.length >= 7 && items.length > 0,
  fn: ({ items, boutiqueSlug, name, phone }) => ({
    boutiqueSlug: boutiqueSlug!,
    name,
    phone,
    items,
    recentlyViewed: (() => {
      try {
        const raw = typeof window !== 'undefined' ? window.localStorage.getItem('mvst_recently_viewed_v1') : null;
        return raw ? (JSON.parse(raw) as RecentItem[]) : [];
      } catch { return []; }
    })(),
    submittedAt: new Date().toISOString(),
  }),
  target: submitFittingRequestFx,
});

$requestPending
  .on(submitFittingRequestFx, () => true)
  .on([submitFittingRequestFx.done, submitFittingRequestFx.fail], () => false);

sample({
  clock: submitFittingRequestFx.done,
  fn: () => 'done' as CartStep,
  target: cartStepSet,
});

sample({
  clock: submitFittingRequestFx.fail,
  fn: ({ error }) => error.message,
  target: requestError,
});
