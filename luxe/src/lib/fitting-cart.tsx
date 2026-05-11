import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import type { RecentItem } from "@/lib/recently-viewed";

export type FittingItem = {
  skuId: number;
  productSlug: string;
  title: string;
  color: string;
  size: string;
  price: number;
  image: string;
};

export type FittingBoutique = {
  slug: string;
  name: string;
  addr: string;
  img: string;
};

export type FittingOrderPayload = {
  items: FittingItem[];
  boutique: FittingBoutique;
  name: string;
  phone: string;
  recentlyViewed?: RecentItem[];
};

const CART_KEY = "mvst.fitting.cart.v1";
const SHEET_SHOWN_KEY = "mvst.fitting.cart.sheetShown.v1";
const MAX_ITEMS = 20;

type Ctx = {
  items: FittingItem[];
  count: number;
  total: number;
  add: (item: FittingItem) => void;
  remove: (skuId: number) => void;
  clear: () => void;
  hasItem: (skuId: number) => boolean;
  // dialog state
  open: boolean;
  setOpen: (v: boolean) => void;
  // bumped whenever a new item is added — consumers can reset their step
  addNonce: number;
};

const FittingCartContext = createContext<Ctx | null>(null);

export function FittingCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FittingItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [open, setOpen] = useState(false);
  const [addNonce, setAddNonce] = useState(0);

  // hydrate from storage
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(CART_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  // persist
  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, hydrated]);

  const add = useCallback((item: FittingItem) => {
    let didAdd = false;
    setItems((prev) => {
      if (prev.some((i) => i.skuId === item.skuId)) return prev;
      if (prev.length >= MAX_ITEMS) {
        toast.error(`В корзину можно добавить не более ${MAX_ITEMS} вещей`);
        return prev;
      }
      didAdd = true;
      return [...prev, item];
    });
    if (didAdd) {
      setAddNonce((n) => n + 1);
      // Открываем модалку только при первом успешном добавлении за сессию.
      try {
        if (!sessionStorage.getItem(SHEET_SHOWN_KEY)) {
          sessionStorage.setItem(SHEET_SHOWN_KEY, "1");
          setOpen(true);
        }
      } catch {
        /* ignore */
      }
    }
  }, []);

  const remove = useCallback((skuId: number) => {
    setItems((prev) => prev.filter((i) => i.skuId !== skuId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const hasItem = useCallback(
    (skuId: number) => items.some((i) => i.skuId === skuId),
    [items],
  );

  const value = useMemo<Ctx>(
    () => ({
      items,
      count: items.length,
      total: items.reduce((acc, i) => acc + i.price, 0),
      add,
      remove,
      clear,
      hasItem,
      open,
      setOpen,
      addNonce,
    }),
    [items, add, remove, clear, hasItem, open, addNonce],
  );

  return <FittingCartContext.Provider value={value}>{children}</FittingCartContext.Provider>;
}

export function useFittingCart() {
  const ctx = useContext(FittingCartContext);
  if (!ctx) throw new Error("useFittingCart must be used inside FittingCartProvider");
  return ctx;
}

// Server function: forwards the fitting order to the MVST CRM.
// Runs on the server so the CRM_INGEST_KEY never reaches the browser.
export const submitFittingOrder = createServerFn({ method: "POST" })
  .inputValidator((payload: FittingOrderPayload) => payload)
  .handler(async ({ data }) => {
    const CRM_URL = process.env.CRM_URL ?? "http://localhost:3001";
    const CRM_INGEST_KEY = process.env.CRM_INGEST_KEY ?? "";

    const items = data.items.map((it) => ({
      key: `${it.skuId}_${it.size}`,
      productId: it.skuId,
      slug: it.productSlug,
      title: it.title,
      brand: "MVST",
      color: it.color,
      image: it.image,
      offerId: it.skuId,
      sizeLabel: it.size,
      price: it.price,
      priceOriginal: it.price,
      qty: 1,
    }));

    const recentlyViewed = (data.recentlyViewed ?? []).slice(0, 10).map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      brand: "MVST",
      image: r.image,
      price: r.price,
      priceOriginal: r.originalPrice,
    }));

    const body = {
      boutiqueSlug: data.boutique.slug,
      name: data.name,
      phone: data.phone,
      items,
      recentlyViewed,
      submittedAt: new Date().toISOString(),
    };

    const res = await fetch(`${CRM_URL}/api/public/fitting-requests`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-crm-api-key": CRM_INGEST_KEY,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      // eslint-disable-next-line no-console
      console.error("[fitting CRM] error", res.status, detail);
      throw new Error(`CRM responded ${res.status}`);
    }
  });
