import { createFileRoute, notFound } from "@tanstack/react-router";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { CatalogPage } from "@/components/site/CatalogPage";
import {
  getCatalogFilters,
  getCategoryTree,
  resolveSection,
  searchProducts,
} from "@/lib/tsum/catalog.functions";
import type { CategoryNode } from "@/lib/tsum/types";

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

function findInTree(n: CategoryNode, id: number): CategoryNode | null {
  if (n.id === id) return n;
  for (const c of n.items ?? []) {
    const f = findInTree(c, id);
    if (f) return f;
  }
  return null;
}

export const Route = createFileRoute("/catalog/$gender_/$section")({
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
    if (params.gender !== "women" && params.gender !== "men") throw notFound();
    const gender = params.gender as "women" | "men";
    const resolved = await resolveSection({ data: { gender, slug: params.section } });
    if (!resolved.sectionId || !Number.isFinite(resolved.sectionId)) throw notFound();
    const sectionId = resolved.sectionId;
    const args = {
      gender,
      sectionId,
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
    const node =
      treeRes.tree.map((root) => findInTree(root, sectionId)).find((x) => x) ??
      filters.filters.category.items.map((root) => findInTree(root, sectionId)).find((x) => x);
    return {
      gender,
      sectionId,
      sectionTitle: node?.title ?? resolved.title ?? "Категория",
      list,
      filters,
      categoryTree: treeRes.tree,
    };
  },
  staleTime: 5 * 60 * 1000,
  head: ({ loaderData, params }) => {
    const g: "women" | "men" = params.gender === "men" ? "men" : "women";
    const t = loaderData?.sectionTitle
      ? `${loaderData.sectionTitle} — ${genderTitle[g]} — MVST`
      : `${genderTitle[g]} — MVST`;
    return {
      meta: [
        { title: t },
        { name: "description", content: `${t}. Коллекция MVST.` },
        { property: "og:title", content: t },
        { property: "og:description", content: `${t}. Коллекция MVST.` },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="px-6 py-32 text-center">
      <h1 className="font-serif text-3xl mb-4">Категория не найдена</h1>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="px-6 py-32 text-center">
      <h1 className="font-serif text-3xl mb-4">Не удалось загрузить раздел</h1>
      <p className="text-foreground/60 text-sm">{error.message}</p>
    </div>
  ),
  component: SectionRouteComponent,
});

function SectionRouteComponent() {
  const data = Route.useLoaderData();
  const search = Route.useSearch();
  const gender: "women" | "men" = data.gender === "men" ? "men" : "women";
  return (
    <CatalogPage
      gender={gender}
      title={genderTitle[gender]}
      sectionId={data.sectionId}
      sectionTitle={data.sectionTitle}
      items={data.list.items}
      filters={data.filters.filters}
      categoryTree={data.categoryTree}
      total={data.list.total}
      page={data.list.page}
      pageCount={data.list.pageCount}
      search={search}
    />
  );
}
