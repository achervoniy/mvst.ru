import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { GENDER_CATEGORY, MVST_BRAND_ID, tsumFetch } from "./client.server";
import type {
  CatalogProduct,
  CategoryNode,
  Gender,
  TsumFilters,
  TsumProduct,
  TsumProductDetail,
  SortId,
} from "./types";

const TSUM_V1 = "https://api.tsum.ru/v1";

const sortEnum = z.enum(["our", "date", "price", "price_desc"]);
const genderEnum = z.enum(["women", "men"]);

const searchInput = z.object({
  gender: genderEnum,
  sectionId: z.number().int().positive().optional(),
  sort: sortEnum.optional(),
  page: z.number().int().min(1).max(200).optional(),
  color: z.number().int().positive().optional(),
  size: z.number().int().positive().optional(),
  priceFrom: z.number().int().nonnegative().optional(),
  priceTo: z.number().int().positive().optional(),
  label: z.union([z.string(), z.number()]).optional(),
});

function buildBody(input: z.infer<typeof searchInput>): Record<string, unknown> {
  const body: Record<string, unknown> = {
    category: input.sectionId ? String(input.sectionId) : GENDER_CATEGORY[input.gender],
    brand: MVST_BRAND_ID,
  };
  if (input.sort) body.sort = input.sort;
  if (input.page) body.page = input.page;
  if (input.color) body.color = input.color;
  if (input.size) body.size = input.size;
  if (input.priceFrom != null) body.priceFrom = input.priceFrom;
  if (input.priceTo != null) body.priceTo = input.priceTo;
  if (input.label != null) body.label = input.label;
  return body;
}

function normalize(p: TsumProduct): CatalogProduct {
  const prices = p.offers
    .map((o) => o.price.priceWithDiscount)
    .filter((n) => Number.isFinite(n) && n > 0);
  const originals = p.offers
    .map((o) => o.price.originalPrice)
    .filter((n) => Number.isFinite(n) && n > 0);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const originalPrice = originals.length ? Math.min(...originals) : minPrice;
  const hasDiscount = originalPrice > minPrice && minPrice > 0;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - minPrice) / originalPrice) * 100)
    : 0;
  const img0 = p.images[0];
  const img1 = p.images[1];
  const pickMedium = (img: typeof img0) =>
    img?.w600 ?? img?.middle ?? img?.w320 ?? img?.small ?? "";
  return {
    id: p.id,
    modelExtId: p.modelExtId,
    slug: `${p.modelExtId}-${p.slug.replace(/^\d+-/, "")}`,
    title: p.title,
    categoryId: p.category.id,
    categorySlug: p.category.slug,
    primaryImage: pickMedium(img0),
    hoverImage: img1 ? pickMedium(img1) : undefined,
    largeImage: img0?.large ?? img0?.w1320 ?? img0?.middle ?? "",
    minPrice,
    originalPrice,
    discountPercent,
    hasDiscount,
    colorTitle: p.color?.title ?? "",
    raw: p,
  };
}

export const searchProducts = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => searchInput.parse(input))
  .handler(async ({ data }) => {
    const items = await tsumFetch<TsumProduct[]>("/catalog/search/brand", buildBody(data));
    return {
      items: items.map(normalize),
      page: data.page ?? 1,
      perPage: 60 as const,
    };
  });

const EMPTY_FILTERS: TsumFilters = {
  brand: { items: [], applied: [], title: "" },
  category: { items: [], applied: [], title: "" },
  color: { items: [], applied: [], title: "" },
  size: { items: [], applied: [], title: "" },
  price: { items: [], applied: [], title: "" },
  sort: { items: [], applied: [], title: "" },
  label: { items: [], applied: [], title: "" },
  attribute: { items: [], applied: [], title: "" },
};

export const getCatalogFilters = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => searchInput.parse(input))
  .handler(async ({ data }) => {
    try {
      const filters = await tsumFetch<TsumFilters>("/catalog/filter", buildBody(data));
      const safe: TsumFilters = { ...EMPTY_FILTERS, ...(filters ?? {}) };
      // Rebrand sort label
      if (safe.sort?.items?.length) {
        safe.sort = {
          ...safe.sort,
          items: safe.sort.items.map((s) =>
            s.id === "our" ? { ...s, title: "Выбор MVST" } : s,
          ),
        };
      }
      const total = safe.price?.items?.[0]?.count ?? 0;
      const pageCount = Math.max(1, Math.ceil(total / 60));
      return { filters: safe, total, pageCount };
    } catch (err) {
      console.error("getCatalogFilters failed:", err);
      return { filters: EMPTY_FILTERS, total: 0, pageCount: 1 };
    }
  });

const sectionResolveInput = z.object({
  gender: genderEnum,
  slug: z.string().min(1).max(200),
});

function findBySlug(n: CategoryNode, slug: string): CategoryNode | null {
  if (n.slug === slug) return n;
  for (const c of n.items ?? []) {
    const f = findBySlug(c, slug);
    if (f) return f;
  }
  return null;
}

export const resolveSection = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => sectionResolveInput.parse(input))
  .handler(async ({ data }) => {
    // Если в slug пришло чисто число — считаем это прямым ID (обратная совместимость).
    if (/^\d+$/.test(data.slug)) {
      return { sectionId: Number(data.slug), title: null as string | null };
    }
    try {
      const filters = await tsumFetch<TsumFilters>("/catalog/filter", {
        category: GENDER_CATEGORY[data.gender],
        brand: MVST_BRAND_ID,
      });
      for (const root of filters?.category?.items ?? []) {
        const node = findBySlug(root, data.slug);
        if (node) return { sectionId: node.id, title: node.title };
      }
    } catch (err) {
      console.error("resolveSection failed:", err);
    }
    // Fallback: попытаемся выдрать число из конца slug (для совсем неизвестных URL).
    const trailing = data.slug.match(/-(\d+)$/)?.[1];
    if (trailing) return { sectionId: Number(trailing), title: null as string | null };
    return { sectionId: null as number | null, title: null as string | null };
  });

const productInput = z.object({
  gender: genderEnum,
  slug: z.string().min(1).max(200),
});

export const getProductBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => productInput.parse(input))
  .handler(async ({ data }) => {
    // slug = `${modelExtId}-...`. Берём modelExtId, ищем по полному списку MVST.
    const modelExtId = data.slug.match(/^(\d+)/)?.[1];
    if (!modelExtId) return { product: null };
    // Перебираем страницы (у MVST ~150 товаров — максимум 3 страницы по 60).
    for (let page = 1; page <= 5; page++) {
      const items = await tsumFetch<TsumProduct[]>("/catalog/search/brand", {
        category: GENDER_CATEGORY[data.gender],
        brand: MVST_BRAND_ID,
        page,
      });
      const found = items.find((p) => p.modelExtId === modelExtId);
      if (found) return { product: normalize(found) };
      if (items.length < 60) break;
    }
    return { product: null };
  });

const detailInput = z.object({ slug: z.string().min(1).max(200) });

async function fetchDetailRaw(apiSlug: string): Promise<TsumProductDetail | null> {
  try {
    return await tsumFetch<TsumProductDetail>(
      `/catalog/product/${encodeURIComponent(apiSlug)}`,
      null,
      { method: "GET", baseUrl: TSUM_V1 },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes(" 404")) return null;
    throw err;
  }
}

export const getProductDetail = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => detailInput.parse(input))
  .handler(async ({ data }) => {
    // Наш URL slug = `${modelExtId}-${apiSlug-без-числового-префикса}`.
    // Реальный slug ЦУМа имеет вид `${modelExtId}-${rest}` — это и есть data.slug.
    let detail = await fetchDetailRaw(data.slug);
    let gender: Gender | null = null;
    if (!detail) {
      // Fallback: восстанавливаем оригинальный slug через поиск по каталогу.
      for (const g of ["women", "men"] as const) {
        const womenRes = await getProductBySlug({ data: { gender: g, slug: data.slug } });
        if (womenRes.product) {
          gender = g;
          detail = await fetchDetailRaw(womenRes.product.raw.slug);
          break;
        }
      }
    } else {
      // Определим gender из категории через дерево фильтров (быстрая эвристика по category.id корня).
      // Достаточно: если категория детали присутствует в дереве women — women, иначе men.
      try {
        const womenFilters = await tsumFetch<TsumFilters>("/catalog/filter", {
          category: GENDER_CATEGORY.women,
          brand: MVST_BRAND_ID,
        });
        const inWomen = womenFilters?.category?.items?.some((root) =>
          containsCategory(root, detail!.category.id),
        );
        gender = inWomen ? "women" : "men";
      } catch {
        gender = "women";
      }
    }
    if (!detail) return { detail: null, gender: null };
    return { detail, gender };
  });

function containsCategory(n: CategoryNode, id: number): boolean {
  if (n.id === id) return true;
  return (n.items ?? []).some((c) => containsCategory(c, id));
}

export type SearchResult = Awaited<ReturnType<typeof searchProducts>>;
export type FiltersResult = Awaited<ReturnType<typeof getCatalogFilters>>;
export type { CatalogProduct, Gender, SortId };

