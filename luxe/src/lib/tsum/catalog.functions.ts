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
const TSUM_CACHE_TTL_MS = 5 * 60 * 1000;

type TsumCacheEntry<T> = {
  expiresAt: number;
  value: T;
};

const tsumCache = new Map<string, TsumCacheEntry<unknown>>();

const sortEnum = z.enum(["our", "date", "price", "price_desc"]);
const genderEnum = z.enum(["women", "men"]);

const searchInput = z.object({
  gender: genderEnum,
  sectionId: z.number().int().positive().optional(),
  sort: sortEnum.optional(),
  page: z.number().int().min(1).max(200).optional(),
  color: z.array(z.number().int().positive()).max(50).optional(),
  size: z.array(z.number().int().positive()).max(50).optional(),
  priceFrom: z.number().int().nonnegative().optional(),
  priceTo: z.number().int().positive().optional(),
  label: z.union([z.string(), z.number()]).optional(),
  attribute: z.array(z.number().int().positive()).max(50).optional(),
});

function getTsumCacheKey(
  path: string,
  body?: Record<string, unknown> | null,
  opts?: { method?: "GET" | "POST"; baseUrl?: string },
): string {
  return JSON.stringify({
    baseUrl: opts?.baseUrl ?? "default",
    method: opts?.method ?? (body ? "POST" : "GET"),
    path,
    body: body ?? null,
  });
}

async function cachedTsumFetch<T>(
  path: string,
  body?: Record<string, unknown> | null,
  opts?: { method?: "GET" | "POST"; baseUrl?: string; ttlMs?: number },
): Promise<T> {
  const key = getTsumCacheKey(path, body, opts);
  const now = Date.now();
  const cached = tsumCache.get(key) as TsumCacheEntry<T> | undefined;
  if (cached && cached.expiresAt > now) return cached.value;

  const value = await tsumFetch<T>(path, body, opts);
  tsumCache.set(key, { value, expiresAt: now + (opts?.ttlMs ?? TSUM_CACHE_TTL_MS) });
  return value;
}

function logTsumFailure(operation: string, data: Record<string, unknown>, err: unknown) {
  const error =
    err instanceof Error ? { name: err.name, message: err.message } : { message: String(err) };
  console.error(
    JSON.stringify({
      level: "error",
      source: "tsum",
      operation,
      data,
      error,
    }),
  );
}

function buildBody(
  input: z.infer<typeof searchInput>,
  opts?: { includePage?: boolean; includePrice?: boolean },
): Record<string, unknown> {
  const includePage = opts?.includePage ?? true;
  // ЦУМ-эндпоинт /catalog/search/brand игнорирует priceFrom/priceTo —
  // фильтрацию по цене делаем на нашей стороне в searchProducts.
  const includePrice = opts?.includePrice ?? false;
  const body: Record<string, unknown> = {
    category: input.sectionId ? String(input.sectionId) : GENDER_CATEGORY[input.gender],
    brand: MVST_BRAND_ID,
  };
  if (input.sort) body.sort = input.sort;
  if (includePage && input.page) body.page = input.page;
  if (input.color && input.color.length > 0) body.color = input.color;
  if (input.size && input.size.length > 0) body.size = input.size;
  if (includePrice && input.priceFrom != null) body.priceFrom = input.priceFrom;
  if (includePrice && input.priceTo != null) body.priceTo = input.priceTo;
  if (input.label != null) body.label = input.label;
  if (input.attribute && input.attribute.length > 0) body.attribute = input.attribute;
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

const PER_PAGE = 60;

export const searchProducts = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => searchInput.parse(input))
  .handler(async ({ data }) => {
    try {
      const hasPriceFilter = data.priceFrom != null || data.priceTo != null;
      const requestedPage = data.page ?? 1;

      if (!hasPriceFilter) {
        const items = await cachedTsumFetch<TsumProduct[]>(
          "/catalog/search/brand",
          buildBody(data),
        );
        return {
          items: items.map(normalize),
          page: requestedPage,
          perPage: PER_PAGE,
        };
      }

      const all: TsumProduct[] = [];
      for (let p = 1; p <= 10; p++) {
        const chunk = await cachedTsumFetch<TsumProduct[]>(
          "/catalog/search/brand",
          buildBody({ ...data, page: p }),
        );
        all.push(...chunk);
        if (chunk.length < PER_PAGE) break;
      }

      const normalized = all.map(normalize);
      const min = data.priceFrom ?? 0;
      const max = data.priceTo ?? Number.POSITIVE_INFINITY;
      const filtered = normalized.filter((p) => p.minPrice >= min && p.minPrice <= max);
      const start = (requestedPage - 1) * PER_PAGE;

      return {
        items: filtered.slice(start, start + PER_PAGE),
        page: requestedPage,
        perPage: PER_PAGE,
        filteredTotal: filtered.length,
      };
    } catch (err) {
      logTsumFailure("searchProducts", data, err);
      throw err;
    }
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
      const filters = await cachedTsumFetch<TsumFilters>("/catalog/filter", buildBody(data));
      const safe: TsumFilters = { ...EMPTY_FILTERS, ...(filters ?? {}) };
      // Rebrand sort label
      if (safe.sort?.items?.length) {
        safe.sort = {
          ...safe.sort,
          items: safe.sort.items.map((s) => (s.id === "our" ? { ...s, title: "Выбор MVST" } : s)),
        };
      }
      const total = safe.price?.items?.[0]?.count ?? 0;
      const pageCount = Math.max(1, Math.ceil(total / 60));
      return { filters: safe, total, pageCount };
    } catch (err) {
      logTsumFailure("getCatalogFilters", data, err);
      throw err;
    }
  });

// Полное дерево категорий бренда для данного пола — без других фильтров.
// Используется в навигации по категориям, чтобы фильтры не «прятали» соседние ветки.
const genderTreeInput = z.object({ gender: genderEnum });
export const getCategoryTree = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => genderTreeInput.parse(input))
  .handler(async ({ data }) => {
    try {
      const filters = await cachedTsumFetch<TsumFilters>("/catalog/filter", {
        category: GENDER_CATEGORY[data.gender],
        brand: MVST_BRAND_ID,
      });
      return { tree: filters.category.items ?? [] };
    } catch (err) {
      logTsumFailure("getCategoryTree", data, err);
      throw err;
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
      const filters = await cachedTsumFetch<TsumFilters>("/catalog/filter", {
        category: GENDER_CATEGORY[data.gender],
        brand: MVST_BRAND_ID,
      });
      for (const root of filters?.category?.items ?? []) {
        const node = findBySlug(root, data.slug);
        if (node) return { sectionId: node.id, title: node.title };
      }
    } catch (err) {
      logTsumFailure("resolveSection", data, err);
      throw err;
    }
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
    try {
      // slug = `${modelExtId}-...`. Берём modelExtId, ищем по полному списку MVST.
      const modelExtId = data.slug.match(/^(\d+)/)?.[1];
      if (!modelExtId) return { product: null };
      // Перебираем страницы (у MVST ~150 товаров — максимум 3 страницы по 60).
      for (let page = 1; page <= 5; page++) {
        const items = await cachedTsumFetch<TsumProduct[]>("/catalog/search/brand", {
          category: GENDER_CATEGORY[data.gender],
          brand: MVST_BRAND_ID,
          page,
        });
        const found = items.find((p) => p.modelExtId === modelExtId);
        if (found) return { product: normalize(found) };
        if (items.length < PER_PAGE) break;
      }
      return { product: null };
    } catch (err) {
      logTsumFailure("getProductBySlug", data, err);
      throw err;
    }
  });

const detailInput = z.object({ slug: z.string().min(1).max(200) });

async function fetchDetailRaw(apiSlug: string): Promise<TsumProductDetail | null> {
  try {
    return await cachedTsumFetch<TsumProductDetail>(
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
    try {
      // Наш URL slug = `${modelExtId}-${apiSlug-без-числового-префикса}`.
      // Реальный slug ЦУМа имеет вид `${modelExtId}-${rest}` — это и есть data.slug.
      let detail = await fetchDetailRaw(data.slug);
      let gender: Gender | null = null;
      if (!detail) {
        // Восстанавливаем оригинальный slug через поиск по каталогу.
        for (const g of ["women", "men"] as const) {
          const productResult = await getProductBySlug({ data: { gender: g, slug: data.slug } });
          if (productResult.product) {
            gender = g;
            detail = await fetchDetailRaw(productResult.product.raw.slug);
            break;
          }
        }
      } else {
        const loadedDetail = detail;
        // Определим gender из категории через дерево фильтров women; если категории там нет, это men.
        const womenFilters = await cachedTsumFetch<TsumFilters>("/catalog/filter", {
          category: GENDER_CATEGORY.women,
          brand: MVST_BRAND_ID,
        });
        const inWomen = womenFilters.category.items.some((root) =>
          containsCategory(root, loadedDetail.category.id),
        );
        gender = inWomen ? "women" : "men";
      }
      if (!detail) return { detail: null, gender: null };
      return { detail, gender };
    } catch (err) {
      logTsumFailure("getProductDetail", data, err);
      throw err;
    }
  });

function containsCategory(n: CategoryNode, id: number): boolean {
  if (n.id === id) return true;
  return (n.items ?? []).some((c) => containsCategory(c, id));
}

export type SearchResult = Awaited<ReturnType<typeof searchProducts>>;
export type FiltersResult = Awaited<ReturnType<typeof getCatalogFilters>>;
export type { CatalogProduct, Gender, SortId };
