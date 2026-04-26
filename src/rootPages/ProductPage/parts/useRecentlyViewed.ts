'use client';

import { useEffect, useState } from 'react';

import type { V1CatalogProduct } from '@/shared/api/product';

const KEY = 'mvst_recently_viewed_v1';
const MAX = 10;

export type RecentItem = {
  id: number;
  slug: string;
  title: string;
  brand: string;
  image: string;
  price: number;
  priceOriginal?: number;
};

function read(): RecentItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(items: RecentItem[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items.slice(0, MAX)));
  } catch {
    /* ignore */
  }
}

function toItem(product: V1CatalogProduct): RecentItem {
  const img = product.images?.[0];
  const imageSrc = img ? img.w400 || img.w200 || img.w2000 || '' : '';
  const offer = product.offers?.find(o => o.quantity > 0) ?? product.offers?.[0];
  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    brand: product.brand.title,
    image: imageSrc,
    price: offer?.price.priceWithDiscount ?? 0,
    priceOriginal: offer?.price.originalPrice,
  };
}

export function useTrackRecentlyViewed(product: V1CatalogProduct) {
  useEffect(() => {
    if (!product?.id) return;
    const current = read().filter(i => i.id !== product.id);
    current.unshift(toItem(product));
    write(current);
  }, [product?.id]);
}

export function useRecentlyViewed(excludeId?: number): RecentItem[] {
  const [items, setItems] = useState<RecentItem[]>([]);
  useEffect(() => {
    const list = read();
    setItems(excludeId ? list.filter(i => i.id !== excludeId) : list);
  }, [excludeId]);
  return items;
}
