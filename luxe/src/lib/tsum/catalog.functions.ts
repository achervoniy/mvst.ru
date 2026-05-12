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

const TSUM_ROOT = "https://api.tsum.ru";
const TSUM_V1 = `${TSUM_ROOT}/v1`;
const TSUM_V4 = `${TSUM_ROOT}/v4`;
// tsumFetch по умолчанию ходит в /v2: /catalog/filter — относительный путь,
// /v4/* и /catalog/search/counter — переопределяем baseUrl явно.
const TSUM_V4_SEARCH = "/catalog/search";
const TSUM_V2_FILTER = "/catalog/filter";
const TSUM_COUNTER = "/catalog/search/counter";
const TSUM_CACHE_TTL_MS = 5 * 60 * 1000;
// Counter дёргается часто из drawer-а на каждое изменение staged-фильтра —
// держим короткий TTL, чтобы не показывать стейл при возврате к старой комбинации.
const TSUM_COUNTER_TTL_MS = 60 * 1000;

interface V4SearchResponse {
  models: TsumProduct[];
  correctedString?: string;
  pagination?: {
    pageNumber?: number;
    pageCount?: number;
    totalCount?: number;
  };
}

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

// Тело для POST /v4/catalog/search. Параметры именуются как ожидает v4:
// price_min/price_max (а не priceFrom/priceTo), labels (а не label).
function buildSearchBody(input: z.infer<typeof searchInput>): Record<string, unknown> {
  const body: Record<string, unknown> = {
    category: input.sectionId ? String(input.sectionId) : GENDER_CATEGORY[input.gender],
    brand: MVST_BRAND_ID,
  };
  if (input.sort) body.sort = input.sort;
  if (input.page) body.page = input.page;
  if (input.color?.length) body.color = input.color;
  if (input.size?.length) body.size = input.size;
  if (input.priceFrom != null) body.price_min = input.priceFrom;
  if (input.priceTo != null) body.price_max = input.priceTo;
  if (input.label != null) body.labels = input.label;
  if (input.attribute?.length) body.attribute = input.attribute;
  return body;
}

// Тело для POST /v2/catalog/filter. Важно: root_category — это всегда
// гендерный корень (18368/18327), иначе counts по size/price будут неверными.
// Текущая выбранная категория опционально передаётся как category.
function buildFilterBody(input: z.infer<typeof searchInput>): Record<string, unknown> {
  const body: Record<string, unknown> = {
    root_category: Number(GENDER_CATEGORY[input.gender]),
    brand: MVST_BRAND_ID,
  };
  if (input.sectionId) body.category = String(input.sectionId);
  if (input.color?.length) body.color = input.color;
  if (input.size?.length) body.size = input.size;
  if (input.priceFrom != null) body.price_min = input.priceFrom;
  if (input.priceTo != null) body.price_max = input.priceTo;
  if (input.label != null) body.labels = input.label;
  if (input.attribute?.length) body.attribute = input.attribute;
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

// Лёгкий counter для preview «Показать N» в drawer-е до применения фильтров.
// TSUM-эндпоинт — GET /catalog/search/counter с query-string. Multi-value
// (color, size, attribute) принимает только в формате comma-separated:
// `color=A,B` → OR. Повтор параметра (`color=A&color=B`) у counter ломается
// (last wins), поэтому всегда join(","). Sort на total не влияет.
function buildCounterQuery(input: z.infer<typeof searchInput>): string {
  const params = new URLSearchParams();
  params.set(
    "section",
    input.sectionId ? String(input.sectionId) : GENDER_CATEGORY[input.gender],
  );
  params.set("brand", String(MVST_BRAND_ID));
  if (input.color?.length) params.set("color", input.color.join(","));
  if (input.size?.length) params.set("size", input.size.join(","));
  if (input.attribute?.length) params.set("attribute", input.attribute.join(","));
  if (input.label != null) params.set("labels", String(input.label));
  if (input.priceFrom != null) params.set("price_min", String(input.priceFrom));
  if (input.priceTo != null) params.set("price_max", String(input.priceTo));
  return params.toString();
}

export const getCatalogCount = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => searchInput.parse(input))
  .handler(async ({ data }) => {
    try {
      const qs = buildCounterQuery(data);
      const res = await cachedTsumFetch<{ total?: number }>(
        `${TSUM_COUNTER}?${qs}`,
        null,
        { method: "GET", baseUrl: TSUM_ROOT, ttlMs: TSUM_COUNTER_TTL_MS },
      );
      return { total: res?.total ?? 0 };
    } catch (err) {
      logTsumFailure("getCatalogCount", data, err);
      throw err;
    }
  });

export const searchProducts = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => searchInput.parse(input))
  .handler(async ({ data }) => {
    try {
      const res = await cachedTsumFetch<V4SearchResponse>(
        TSUM_V4_SEARCH,
        buildSearchBody(data),
        { baseUrl: TSUM_V4 },
      );
      const items = (res.models ?? []).map(normalize);
      const total = res.pagination?.totalCount ?? items.length;
      const pageCount = res.pagination?.pageCount ?? Math.max(1, Math.ceil(total / PER_PAGE));
      const page = res.pagination?.pageNumber ?? data.page ?? 1;
      return { items, page, perPage: PER_PAGE, total, pageCount };
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
      const raw = await cachedTsumFetch<TsumFilters>(
        TSUM_V2_FILTER,
        buildFilterBody(data),
      );
      const safe: TsumFilters = { ...EMPTY_FILTERS, ...(raw ?? {}) };
      // Скрываем пункты с count=0 и пустые группы — TSUM отдаёт «всё подряд»
      // даже если по текущим фильтрам выборка пустая.
      safe.color = {
        ...safe.color,
        items: (safe.color.items ?? []).filter((c) => (c.count ?? 0) > 0),
      };
      safe.size = {
        ...safe.size,
        items: (safe.size.items ?? []).filter((s) => (s.count ?? 0) > 0),
      };
      safe.attribute = {
        ...safe.attribute,
        items: (safe.attribute.items ?? [])
          .map((group) => ({
            ...group,
            items: (group.items ?? []).filter((a) => (a.count ?? 0) > 0),
          }))
          .filter((group) => group.items.length > 0),
      };
      safe.label = {
        ...safe.label,
        items: (safe.label.items ?? []).filter((l) => (l.count ?? 0) > 0),
      };
      // Rebrand sort label
      if (safe.sort?.items?.length) {
        safe.sort = {
          ...safe.sort,
          items: safe.sort.items.map((s) => (s.id === "our" ? { ...s, title: "Выбор MVST" } : s)),
        };
      }
      return { filters: safe };
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
      const filters = await cachedTsumFetch<TsumFilters>(TSUM_V2_FILTER, {
        root_category: Number(GENDER_CATEGORY[data.gender]),
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
      const filters = await cachedTsumFetch<TsumFilters>(TSUM_V2_FILTER, {
        root_category: Number(GENDER_CATEGORY[data.gender]),
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
        const res = await cachedTsumFetch<V4SearchResponse>(
          TSUM_V4_SEARCH,
          {
            category: GENDER_CATEGORY[data.gender],
            brand: MVST_BRAND_ID,
            page,
          },
          { baseUrl: TSUM_V4 },
        );
        const items = res.models ?? [];
        const found = items.find((p) => p.modelExtId === modelExtId);
        if (found) return { product: normalize(found) };
        const last = res.pagination?.pageCount ?? page;
        if (page >= last || items.length < PER_PAGE) break;
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
        const womenFilters = await cachedTsumFetch<TsumFilters>(TSUM_V2_FILTER, {
          root_category: Number(GENDER_CATEGORY.women),
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
