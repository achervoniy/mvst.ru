'use client';

import { MiniProductsCarousel } from './MiniProductsCarousel';
import { useRecentlyViewed } from './useRecentlyViewed';

type Props = { currentId: number };

export function RecentlyViewed({ currentId }: Props) {
  const items = useRecentlyViewed(currentId);
  if (items.length === 0) return null;
  return <MiniProductsCarousel title="Вы недавно смотрели" products={items} />;
}
