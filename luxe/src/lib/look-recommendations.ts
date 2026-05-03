import looksData from "@/data/looks.json";
import type { Collection } from "@/types/looks";

const collection = looksData as unknown as Collection;

export type ShelfItem = {
  id: number;
  slug: string;
  title: string;
  image: string;
  price: number;
  originalPrice: number;
};

/**
 * Возвращает товары MVST из тех же лукбук-образов, где встречается данный itemId.
 * Дедуплицирует по id, исключает сам товар, ограничивает лимитом.
 */
export function getLookComplementsByItemId(
  itemId: number,
  limit = 12,
): ShelfItem[] {
  const seen = new Set<number>([itemId]);
  const result: ShelfItem[] = [];

  for (const look of collection.looks) {
    const hasTarget = look.products.some((p) => p.itemId === itemId);
    if (!hasTarget) continue;

    for (const p of look.products) {
      if (p.brand !== "MVST") continue;
      if (seen.has(p.itemId)) continue;
      seen.add(p.itemId);
      result.push({
        id: p.itemId,
        slug: p.slug,
        title: p.title,
        image: p.imageSmall,
        price: p.price.discounted,
        originalPrice: p.price.original,
      });
      if (result.length >= limit) return result;
    }
  }

  return result;
}
