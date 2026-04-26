'use client';

import { useEffect, useState } from 'react';

import { clientApi } from '@/shared/api/clientFetch';

import { HOME_PAGE_FILTERS } from '@/constants/runtimeConfig';

import { MiniProductsCarousel } from './MiniProductsCarousel';
import type { RecentItem } from './useRecentlyViewed';

type Props = {
  categoryId: number;
  currentId: number;
};

type V2Image = {
  w400?: string;
  w200?: string;
  w320?: string;
  w600?: string;
  middle?: string;
  small?: string;
  tiny?: string;
};

type V2Offer = {
  price?: { originalPrice?: number; priceWithDiscount?: number };
  discount?: number;
  quantity?: number;
};

type V2Product = {
  id: number;
  slug: string;
  title: string;
  brand?: { title?: string };
  images?: V2Image[];
  offers?: V2Offer[];
};

function mapProduct(p: V2Product): RecentItem {
  const img = p.images?.[0] ?? {};
  const offer = p.offers?.[0];
  const priceDisc = offer?.price?.priceWithDiscount ?? 0;
  const priceOrig = offer?.price?.originalPrice;
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    brand: p.brand?.title ?? '',
    image: img.w400 || img.middle || img.w320 || img.small || img.w200 || img.tiny || '',
    price: priceDisc,
    priceOriginal: priceOrig && priceOrig > priceDisc ? priceOrig : undefined,
  };
}

export function RelatedProducts({ categoryId, currentId }: Props) {
  const [items, setItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    let aborted = false;
    // Endpoint возвращает массив товаров напрямую (не `{ list: [...] }`).
    clientApi<V2Product[] | { list?: V2Product[] }>('/v2/catalog/search/brand', {
      method: 'POST',
      body: JSON.stringify({
        brand: HOME_PAGE_FILTERS.female.brand,
        category: categoryId,
        limit: 12,
        page: 1,
      }),
    }).then(res => {
      if (aborted || !res) return;
      const arr: V2Product[] = Array.isArray(res) ? res : res.list ?? [];
      const list = arr
        .filter(p => p.id !== currentId)
        .slice(0, 10)
        .map(mapProduct);
      setItems(list);
    });
    return () => {
      aborted = true;
    };
  }, [categoryId, currentId]);

  if (items.length === 0) return null;
  return <MiniProductsCarousel title="Вам может понравиться" products={items} />;
}
