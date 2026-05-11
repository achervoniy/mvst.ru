import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { CatalogPage } from "@/components/site/CatalogPage";
import { getCatalogFilters, getCategoryTree, searchProducts } from "@/lib/tsum/catalog.functions";

const sortEnum = z.enum(["our", "date", "price", "price_desc"]);

const searchSchema = z.object({
  sort: fallback(sortEnum, "our").optional(),
  page: fallback(z.number().int().min(1), 1).optional(),
  color: fallback(z.array(z.number().int()), undefined as unknown as number[]).optional(),
  size: fallback(z.array(z.number().int()), undefined as unknown as number[]).optional(),
  priceFrom: fallback(z.number().int(), undefined as unknown as number).optional(),
  priceTo: fallback(z.number().int(), undefined as unknown as number).optional(),
  label: fallback(z.union([z.string(), z.number()]), undefined as unknown as string).optional(),
  attribute: fallback(z.array(z.number().int()), undefined as unknown as number[]).optional(),
});

const genderTitle: Record<"women" | "men", string> = {
  women: "Женское",
  men: "Мужское",
};

export const Route = createFileRoute("/catalog/$gender")({
  validateSearch: zodValidator(searchSchema),
  loaderDeps: ({ search }) => ({
    sort: search.sort,
    page: search.page,
    color: search.color,
    size: search.size,
    priceFrom: search.priceFrom,
    priceTo: search.priceTo,
    label: search.label,
    attribute: search.attribute,
  }),
  loader: async ({ params, deps }) => {
    if (params.gender !== "women" && params.gender !== "men") {
      throw new Error("Invalid gender");
    }
    const gender = params.gender as "women" | "men";
    const args = {
      gender,
      sort: deps.sort,
      page: deps.page,
      color: deps.color,
      size: deps.size,
      priceFrom: deps.priceFrom,
      priceTo: deps.priceTo,
      label: deps.label,
      attribute: deps.attribute,
    } as const;
    const [list, filters, treeRes] = await Promise.all([
      searchProducts({ data: args }),
      getCatalogFilters({ data: args }),
      getCategoryTree({ data: { gender } }),
    ]);
    return { gender, list, filters, categoryTree: treeRes.tree };
  },
  staleTime: 5 * 60 * 1000,
  head: ({ params }) => {
    const g: "women" | "men" = params.gender === "men" ? "men" : "women";
    const t = `${genderTitle[g]} — MVST`;
    const d = `Коллекция MVST: одежда, обувь, аксессуары. Свободный выбор по категориям, цвету, размеру и цене.`;
    return {
      meta: [
        { title: t },
        { name: "description", content: d },
        { property: "og:title", content: t },
        { property: "og:description", content: d },
      ],
    };
  },
  errorComponent: CatalogError,
  component: CatalogRouteComponent,
});

function CatalogRouteComponent() {
  const data = Route.useLoaderData();
  const search = Route.useSearch();
  const gender: "women" | "men" = data.gender === "men" ? "men" : "women";
  const filteredTotal = (data.list as { filteredTotal?: number }).filteredTotal;
  const total = filteredTotal ?? data.filters.total;
  const pageCount =
    filteredTotal != null
      ? Math.max(1, Math.ceil(filteredTotal / data.list.perPage))
      : data.filters.pageCount;
  return (
    <CatalogPage
      gender={gender}
      title={genderTitle[gender]}
      items={data.list.items}
      filters={data.filters.filters}
      categoryTree={data.categoryTree}
      total={total}
      page={data.list.page}
      pageCount={pageCount}
      search={search}
    />
  );
}

function CatalogError({ error }: { error: Error }) {
  return (
    <div className="px-6 py-32 text-center">
      <h1 className="font-serif text-3xl mb-4">Не удалось загрузить каталог</h1>
      <p className="text-foreground/60 text-sm">{error.message}</p>
    </div>
  );
}
