import { useEffect, useState } from "react";

const STORAGE_KEY = "mvst:recently-viewed:v1";
const MAX_ITEMS = 10;

export type RecentItem = {
  id: number;
  slug: string;
  title: string;
  image: string;
  price: number;
  originalPrice: number;
};

function read(): RecentItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is RecentItem =>
        x &&
        typeof x.id === "number" &&
        typeof x.slug === "string" &&
        typeof x.title === "string",
    );
  } catch {
    return [];
  }
}

function write(items: RecentItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("mvst:recently-viewed-change"));
  } catch {
    // ignore quota / disabled storage
  }
}

export function pushRecentlyViewed(item: RecentItem): void {
  if (typeof window === "undefined") return;
  const current = read().filter((x) => x.id !== item.id);
  current.unshift(item);
  write(current.slice(0, MAX_ITEMS));
}

/**
 * Хук возвращает список недавно просмотренных, исключая опциональный id.
 * До монтирования возвращает [] — чтобы SSR/CSR совпадали.
 */
export function useRecentlyViewed(excludeId?: number): RecentItem[] {
  const [items, setItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    setItems(read());
    const onChange = () => setItems(read());
    window.addEventListener("mvst:recently-viewed-change", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("mvst:recently-viewed-change", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  return excludeId === undefined
    ? items
    : items.filter((x) => x.id !== excludeId);
}
