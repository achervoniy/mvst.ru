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

export type LookOutfit = {
  lookId: number;
  sort: number;
  image: string;
  products: ShelfItem[];
};

/**
 * Возвращает образы из лукбука, в которых встречается данный itemId.
 * Для каждого образа отдаёт его модельное фото и MVST-товары (включая сам товар).
 * Дедуплицирует образы по набору товаров: если два луга содержат тот же набор MVST-товаров
 * (например, один и тот же образ снят с двух ракурсов), берём только первый.
 * Пропускает образы, где после фильтра не осталось MVST-товаров.
 */
export function getLookOutfitsByItemId(
  itemId: number,
  limit = 6,
): LookOutfit[] {
  const outfits: LookOutfit[] = [];
  const seenSignatures = new Set<string>();

  for (const look of collection.looks) {
    const hasTarget = look.products.some((p) => p.itemId === itemId);
    if (!hasTarget) continue;

    const seenIds = new Set<number>();
    const products: ShelfItem[] = [];
    for (const p of look.products) {
      if (p.brand !== "MVST") continue;
      if (seenIds.has(p.itemId)) continue;
      seenIds.add(p.itemId);
      products.push({
        id: p.itemId,
        slug: p.slug,
        title: p.title,
        image: p.imageSmall,
        price: p.price.discounted,
        originalPrice: p.price.original,
      });
    }
    if (products.length === 0) continue;

    const signature = [...seenIds].sort((a, b) => a - b).join(",");
    if (seenSignatures.has(signature)) continue;
    seenSignatures.add(signature);

    outfits.push({
      lookId: look.id,
      sort: look.sort,
      image: look.image,
      products,
    });
    if (outfits.length >= limit) break;
  }

  return outfits;
}
