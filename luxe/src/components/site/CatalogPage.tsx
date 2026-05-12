import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronRight as ChevronRightIcon,
  SlidersHorizontal,
  X as XIcon,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { formatRub, pluralizeRu } from "@/lib/format";
import type { CatalogProduct } from "@/lib/tsum/types";
import type { TsumFilters, CategoryNode, Gender, AttrGroup } from "@/lib/tsum/types";

export interface CatalogSearch {
  sort?: "our" | "date" | "price" | "price_desc";
  page?: number;
  color?: number[];
  size?: number[];
  priceFrom?: number;
  priceTo?: number;
  label?: string | number;
  attribute?: number[];
}

function sanitizeSearch(next: CatalogSearch): CatalogSearch {
  const cleaned = { ...next };
  Object.keys(cleaned).forEach((k) => {
    const key = k as keyof CatalogSearch;
    const v = cleaned[key];
    if (v === undefined || v === "" || v === null) {
      delete cleaned[key];
    } else if (Array.isArray(v) && v.length === 0) {
      delete cleaned[key];
    }
  });
  return cleaned;
}

interface CatalogPageProps {
  gender: Gender;
  title: string;
  sectionId?: number;
  sectionTitle?: string;
  items: CatalogProduct[];
  filters: TsumFilters;
  categoryTree?: CategoryNode[];
  total: number;
  page: number;
  pageCount: number;
  search: CatalogSearch;
}

export function CatalogPage(props: CatalogPageProps) {
  const {
    gender,
    title,
    sectionId,
    sectionTitle,
    items,
    filters,
    categoryTree,
    total,
    page,
    pageCount,
    search,
  } = props;
  const navigate = useNavigate();
  const [optimisticSearch, setOptimisticSearch] = useState<CatalogSearch>(search);
  const [isNavigationPending, setIsNavigationPending] = useState(false);

  useEffect(() => {
    setOptimisticSearch(search);
    setIsNavigationPending(false);
  }, [search]);

  // Если только что сменили категорию и по текущим фильтрам там ничего нет —
  // сбрасываем фильтры, оставив раздел и сортировку. Категория важнее остальных
  // фильтров, но менять/применять отдельные фильтры внутри категории не должно
  // приводить к их обнулению — пользователь сам видит «ничего не найдено».
  const isEmpty = items.length === 0;
  const prevSectionIdRef = useRef<number | undefined>(sectionId);
  useEffect(() => {
    if (isNavigationPending) {
      prevSectionIdRef.current = sectionId;
      return;
    }
    const sectionChanged = prevSectionIdRef.current !== sectionId;
    prevSectionIdRef.current = sectionId;
    if (!sectionChanged) return;
    if (!isEmpty) return;
    const hasFilters =
      (search.color?.length ?? 0) > 0 ||
      (search.size?.length ?? 0) > 0 ||
      search.priceFrom != null ||
      search.priceTo != null ||
      (search.attribute?.length ?? 0) > 0;
    if (!hasFilters) return;
    setIsNavigationPending(true);
    setOptimisticSearch({ sort: search.sort });
    void navigate({
      to: sectionId ? "/catalog/$gender/$section" : "/catalog/$gender",
      params: sectionId
        ? { gender, section: getSectionParamFromTree(filters.category.items, sectionId) ?? String(sectionId) }
        : { gender },
      search: () => ({ sort: search.sort }),
      replace: true,
    });
  }, [
    sectionId,
    isEmpty,
    isNavigationPending,
    search,
    navigate,
    gender,
    filters.category.items,
  ]);

  const displayedSearch = isNavigationPending ? optimisticSearch : search;

  // Сколько применено фильтров (без учёта категории и сортировки).
  const appliedFilterCount =
    (displayedSearch.color?.length ?? 0) +
    (displayedSearch.size?.length ?? 0) +
    (displayedSearch.priceFrom != null || displayedSearch.priceTo != null ? 1 : 0) +
    (displayedSearch.attribute?.length ?? 0);
  const hasAppliedFilters = appliedFilterCount > 0;

  const updateSearch = (patch: Partial<CatalogSearch>, resetPage = true) => {
    const next = sanitizeSearch({
      ...(isNavigationPending ? optimisticSearch : search),
      ...patch,
    });
    if (resetPage) delete next.page;
    setOptimisticSearch(next);
    setIsNavigationPending(true);

    void navigate({
      to: sectionId ? "/catalog/$gender/$section" : "/catalog/$gender",
      params: sectionId
        ? {
            gender,
            section:
              getSectionParamFromTree(filters.category.items, sectionId) ?? String(sectionId),
          }
        : { gender },
      search: () => next,
    }).catch((err) => {
      setOptimisticSearch(search);
      setIsNavigationPending(false);
      const error =
        err instanceof Error ? { name: err.name, message: err.message } : { message: String(err) };
      console.error(
        JSON.stringify({
          level: "error",
          source: "catalog-navigation",
          operation: "updateSearch",
          patch,
          error,
        }),
      );
    });
  };

  const sortItems = filters.sort?.items ?? [];
  const currentSortId = (displayedSearch.sort ??
    sortItems.find((s) => s.isDefault)?.id ??
    "our") as string;
  const currentSortTitle = sortItems.find((s) => s.id === currentSortId)?.title ?? "Сортировка";

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const stickySentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stickySentinelRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        const rect = entry.boundingClientRect;
        setShowStickyBar(!entry.isIntersecting && rect.top < 0);
      },
      { threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <SiteLayout>
      {/* Breadcrumbs — на мобиле в одну строку с горизонтальным свайпом */}
      <nav
        aria-label="breadcrumb"
        className="pt-4 overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <ol className="flex items-center px-4 md:px-10 max-w-[1360px] 3xl:max-w-[1800px] md:mx-auto md:w-full eyebrow text-foreground/60 text-[10px]">
          <li>
            <Link to="/" className="hover:text-accent">
              Главная
            </Link>
          </li>
          <li className="flex items-center">
            <span className="mx-2">·</span>
            <Link
              to="/catalog/$gender"
              params={{ gender }}
              search={(prev: CatalogSearch) => prev}
              className="hover:text-accent"
            >
              {title}
            </Link>
          </li>
          {(() => {
            const path = sectionId
              ? getCategoryPath(filters.category.items, gender, sectionId)
              : [];
            return path.map((node, i) => {
              const isLast = i === path.length - 1;
              return (
                <li key={node.id} className="flex items-center">
                  <span className="mx-2">·</span>
                  {isLast ? (
                    <span className="text-foreground">{node.title}</span>
                  ) : (
                    <Link
                      to="/catalog/$gender/$section"
                      params={{ gender, section: node.slug }}
                      search={(prev: CatalogSearch) => prev}
                      className="hover:text-accent"
                    >
                      {node.title}
                    </Link>
                  )}
                </li>
              );
            });
          })()}
        </ol>
      </nav>

      {/* Title row — только на мобиле; на десктопе H1 переезжает в тулбар */}
      <div className="md:hidden px-4 pt-3 text-center pb-1 flex items-start justify-between gap-4">
        <h1 className="font-serif text-3xl flex-1 min-w-0 line-clamp-2 break-words">
          {sectionTitle ?? title}
        </h1>
        {/* Mobile filters trigger — иконка на одной линии с заголовком */}
        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          aria-label="Фильтры"
          className="relative shrink-0 ml-2 inline-flex items-center justify-center h-10 w-10 border border-foreground/30 hover:border-foreground"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {hasAppliedFilters && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-accent text-background text-[10px] leading-none">
              {appliedFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile counter — по центру под заголовком */}
      <div className="md:hidden px-4 pb-0 text-center text-xs text-foreground/60">
        {total.toLocaleString("ru-RU")} {pluralizeRu(total, ["вещь", "вещи", "вещей"])}
      </div>

      {/* Mobile sectioned drawer */}
      <MobileFiltersDrawer
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        gender={gender}
        filters={filters}
        categoryTree={categoryTree}
        activeSectionId={sectionId}
        sectionTitle={sectionTitle}
        search={displayedSearch}
        total={total}
        currentSortTitle={currentSortTitle}
        onChange={updateSearch}
      />

      {/* Sticky filters bar — появляется при скролле мимо исходной кнопки (на мобиле и десктопе) */}
      <div
        className={cn(
          "sticky z-30 bg-background border-y hairline overflow-visible transition-opacity duration-200 after:absolute after:inset-x-0 after:top-full after:h-2 after:pointer-events-none after:bg-background after:content-['']",
          showStickyBar ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        style={{ top: "calc(var(--header-h, 60px) - 1px)" }}
      >
        {/* Mobile sticky-бар */}
        <div className="md:hidden grid h-12 grid-cols-[3rem_minmax(0,1fr)_3rem] items-center max-w-[1360px] mx-auto">
          <div aria-hidden="true" />
          <div className="min-w-0 text-center text-xs uppercase tracking-wider leading-none text-foreground/70 truncate">
            {sectionTitle ?? title} · {total.toLocaleString("ru-RU")}
          </div>
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            aria-label="Фильтры"
            className="relative h-12 w-12 inline-flex items-center justify-center border-l border-foreground/30 hover:border-foreground"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {hasAppliedFilters && (
              <span className="absolute top-2 right-2 inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-accent text-background text-[10px] leading-none">
                {appliedFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Desktop sticky-бар */}
        <div className="hidden md:flex h-14 items-center justify-between max-w-[1360px] 3xl:max-w-[1800px] mx-auto px-4 md:px-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="eyebrow flex items-center gap-2 border-b border-foreground/30 pb-1 hover:border-foreground">
                {currentSortTitle}
                <ChevronDown className="size-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {sortItems.map((s) => (
                <DropdownMenuItem
                  key={s.id}
                  onClick={() => updateSearch({ sort: s.id === "our" ? undefined : s.id })}
                  className={cn(currentSortId === s.id && "text-accent")}
                >
                  {s.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="eyebrow flex items-center gap-2 border-b border-foreground/30 pb-1 hover:border-foreground"
          >
            <SlidersHorizontal className="size-3.5" />
            Фильтры
            {hasAppliedFilters && (
              <span className="inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-accent text-background text-[10px] leading-none">
                {appliedFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="px-4 md:px-10 pb-16 max-w-[1360px] 3xl:max-w-[1800px] mx-auto w-full">
        <div className="min-w-0">
          {/* Sentinel — отслеживаем, чтобы показать sticky-бар при скролле */}
          <div ref={stickySentinelRef} aria-hidden="true" className="h-px w-full" />

          {/* Toolbar — только десктоп */}
          <div className="hidden md:grid items-center gap-3 pt-0 pb-3 border-b hairline grid-cols-[1fr_auto_1fr]">
            <div className="justify-self-start">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="eyebrow flex items-center gap-2 border-b border-foreground/30 pb-1 hover:border-foreground">
                    {currentSortTitle}
                    <ChevronDown className="size-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {sortItems.map((s) => (
                    <DropdownMenuItem
                      key={s.id}
                      onClick={() => updateSearch({ sort: s.id === "our" ? undefined : s.id })}
                      className={cn(currentSortId === s.id && "text-accent")}
                    >
                      {s.title}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <h1 className="font-serif text-2xl md:text-3xl text-center truncate justify-self-center max-w-full px-4">
              {sectionTitle ?? title}
            </h1>

            <div className="justify-self-end">
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="eyebrow flex items-center gap-2 border-b border-foreground/30 pb-1 hover:border-foreground"
              >
                <SlidersHorizontal className="size-3.5" />
                Фильтры
              </button>
            </div>
          </div>

          {/* Desktop counter — мелким шрифтом под тулбаром */}
          <div className="hidden md:block text-center text-xs text-foreground/60 pt-3">
            {total.toLocaleString("ru-RU")} {pluralizeRu(total, ["вещь", "вещи", "вещей"])}
          </div>

          {/* Grid */}
          {items.length === 0 ? (
            <div className="py-20 text-center text-foreground/60">
              По выбранным фильтрам ничего не найдено.
            </div>
          ) : (
            // `3xl:grid-cols-4!` — important нужен, потому что в Tailwind 4
            // кастомный брейкпоинт 3xl сортируется в каскаде раньше md, и
            // без ! md:grid-cols-3 перебивает 4 колонки на широких экранах.
            <div className="grid grid-cols-2 md:grid-cols-3 3xl:grid-cols-4! gap-x-4 sm:gap-x-5 md:gap-x-6 gap-y-10 pt-4 md:pt-6">
              {items.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pageCount > 1 && (
            <PaginationStrip
              page={page}
              pageCount={pageCount}
              onJump={(p) => updateSearch({ page: p === 1 ? undefined : p }, false)}
            />
          )}
        </div>
      </div>
    </SiteLayout>
  );
}

// ────────────── FILTERS SIDEBAR ──────────────

function FiltersSidebar({
  gender,
  filters,
  activeSectionId,
  search,
  onChange,
  onNavigate,
  mobile = false,
}: {
  gender: Gender;
  filters: TsumFilters;
  activeSectionId?: number;
  search: CatalogSearch;
  onChange: (patch: Partial<CatalogSearch>, resetPage?: boolean) => void;
  onNavigate?: () => void;
  mobile?: boolean;
}) {
  const genderRoot =
    filters.category.items.find((r) =>
      r.title.toLowerCase().startsWith(gender === "women" ? "женск" : "мужск"),
    ) ?? filters.category.items[gender === "men" ? 1 : 0];
  const tree = genderRoot?.items ?? [];
  const colors = useMemo(() => filters.color.items ?? [], [filters.color.items]);
  const sizes = useMemo(() => filters.size.items ?? [], [filters.size.items]);
  const attributes = useMemo(() => filters.attribute.items ?? [], [filters.attribute.items]);
  const priceBucket = filters.price.items?.[0];

  const activeAttrs = search.attribute ?? [];
  const activeColors = search.color ?? [];
  const activeSizes = search.size ?? [];
  const hasAnyFilter =
    activeColors.length > 0 ||
    activeSizes.length > 0 ||
    !!search.priceFrom ||
    !!search.priceTo ||
    activeAttrs.length > 0;

  const toggleAttr = (id: number) => {
    const set = new Set(activeAttrs);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    const next = Array.from(set);
    onChange({ attribute: next.length > 0 ? next : undefined });
  };
  const toggleColor = (id: number) => {
    const set = new Set(activeColors);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    const next = Array.from(set);
    onChange({ color: next.length > 0 ? next : undefined });
  };
  const toggleSize = (id: number) => {
    const set = new Set(activeSizes);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    const next = Array.from(set);
    onChange({ size: next.length > 0 ? next : undefined });
  };

  const labelCls = cn("eyebrow text-foreground/60", mobile ? "text-xs mb-4" : "mb-3");

  return (
    <div className={cn("pb-10", mobile ? "space-y-7" : "space-y-5")}>
      {hasAnyFilter && (
        <button
          type="button"
          onClick={() =>
            onChange(
              {
                color: undefined,
                size: undefined,
                priceFrom: undefined,
                priceTo: undefined,
                attribute: undefined,
              },
              true,
            )
          }
          className={cn(
            "eyebrow text-foreground/60 hover:text-accent border-b border-foreground/20",
            mobile ? "text-xs pb-1.5" : "pb-1",
          )}
        >
          Сбросить фильтры
        </button>
      )}

      {tree.length > 0 && (
        <div>
          <div className={labelCls}>Категории</div>
          <CategoryTree
            nodes={tree}
            gender={gender}
            activeId={activeSectionId}
            mobile={mobile}
            onNavigate={onNavigate}
          />
        </div>
      )}

      {priceBucket && priceBucket.min < priceBucket.max && (
        <PriceFilter
          min={priceBucket.min}
          max={priceBucket.max}
          from={search.priceFrom}
          to={search.priceTo}
          onApply={(from, to) => onChange({ priceFrom: from, priceTo: to })}
          mobile={mobile}
        />
      )}

      {colors.length > 0 && (
        <div>
          <div className={labelCls}>Цвет</div>
          <div className={cn("flex flex-wrap", mobile ? "gap-2.5" : "gap-2")}>
            {colors.map((c) => {
              const active = activeColors.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  title={`${c.title} (${c.count})`}
                  onClick={() => toggleColor(c.id)}
                  className={cn(
                    "rounded-full border transition-all",
                    mobile ? "size-9" : "size-7",
                    active
                      ? "ring-2 ring-offset-2 ring-foreground ring-offset-background border-transparent"
                      : "border-foreground/20 hover:border-foreground/50",
                  )}
                  style={{
                    backgroundColor: c.hex ? `#${c.hex}` : undefined,
                    backgroundImage: c.imageUrl ? `url(${c.imageUrl})` : undefined,
                    backgroundSize: "cover",
                  }}
                  aria-label={c.title}
                />
              );
            })}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div>
          <div className={labelCls}>Размер (RU)</div>
          <div className={cn("grid grid-cols-4", mobile ? "gap-1.5" : "gap-1")}>
            {sizes.map((s) => {
              const active = activeSizes.includes(s.id);
              const label = s.title.replace(/^RU\s*/i, "");
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleSize(s.id)}
                  title={s.title}
                  className={cn(
                    "px-1 tracking-wider border transition-colors flex items-center justify-center",
                    mobile ? "h-11 text-sm" : "h-8 text-[11px]",
                    active
                      ? "border-foreground bg-foreground text-background"
                      : "border-foreground/15 hover:border-foreground/60 hover:bg-foreground/[0.03]",
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {attributes.length > 0 && (
        <Accordion type="multiple" className="border-t hairline">
          {attributes.map((group) => (
            <AccordionItem key={group.id} value={String(group.id)}>
              <AccordionTrigger className={cn("eyebrow", mobile && "text-sm py-4")}>
                {group.title}
              </AccordionTrigger>
              <AccordionContent>
                <ul className={cn(mobile ? "space-y-2.5" : "space-y-1.5")}>
                  {group.items.map((a: AttrGroup) => {
                    const checked = activeAttrs.includes(a.id);
                    return (
                      <li key={a.id}>
                        <button
                          type="button"
                          onClick={() => toggleAttr(a.id)}
                          aria-pressed={checked}
                          className={cn(
                            "w-full flex items-center justify-between text-left transition-colors",
                            checked
                              ? "text-foreground"
                              : "text-foreground/70 hover:text-foreground",
                            mobile ? "text-base py-1.5" : "text-sm py-0.5",
                          )}
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className={cn(
                                "inline-flex items-center justify-center size-4 border transition-colors shrink-0",
                                checked
                                  ? "bg-foreground border-foreground text-background"
                                  : "border-foreground/30",
                              )}
                              aria-hidden="true"
                            >
                              {checked && (
                                <svg
                                  viewBox="0 0 12 12"
                                  className="size-3 fill-none stroke-current stroke-2"
                                >
                                  <polyline points="2,6 5,9 10,3" />
                                </svg>
                              )}
                            </span>
                            <span>{a.title}</span>
                          </span>
                          <span className="text-foreground/40 text-xs">{a.count}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}

// ────────────── CATEGORY PANELS (slide screens) ──────────────

function findPath(roots: CategoryNode[], id: number): CategoryNode[] | null {
  for (const r of roots) {
    if (r.id === id) return [r];
    const found = findPath(r.items ?? [], id);
    if (found) return [r, ...found];
  }
  return null;
}

function CategoryTree({
  nodes,
  gender,
  activeId,
  mobile = false,
  onNavigate,
}: {
  nodes: CategoryNode[];
  gender: Gender;
  activeId?: number;
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  // Стек открытых веток. По умолчанию — путь до активного раздела,
  // но без промежуточных уровней с единственным выбором (чтобы не показывать
  // экран с одним пунктом).
  const initialStack = useMemo<CategoryNode[]>(() => {
    if (!activeId) return [];
    const path = findPath(nodes, activeId);
    if (!path) return [];
    const parents = path.slice(0, -1);
    let end = parents.length;
    while (end > 0 && (parents[end - 1].items?.length ?? 0) <= 1) end--;
    return parents.slice(0, end);
  }, [nodes, activeId]);

  const [stack, setStack] = useState<CategoryNode[]>(initialStack);
  const navigate = useNavigate();

  useEffect(() => {
    setStack(initialStack);
  }, [initialStack]);

  const current = stack[stack.length - 1];
  const items = current ? (current.items ?? []) : nodes;

  // Если в раскрываемой ветке только 1 выбор (одна цепочка) — переходим сразу,
  // не показывая промежуточный экран.
  const push = (n: CategoryNode) => {
    let cur: CategoryNode = n;
    const path: CategoryNode[] = [n];
    while ((cur.items?.length ?? 0) === 1) {
      cur = cur.items[0];
      path.push(cur);
    }
    if ((cur.items?.length ?? 0) === 0) {
      void navigate({
        to: "/catalog/$gender/$section",
        params: { gender, section: cur.slug },
        search: (prev: CatalogSearch) => prev,
      });
      onNavigate?.();
      return;
    }
    setStack((s) => [...s, ...path]);
  };
  const back = () => setStack((s) => s.slice(0, -1));

  const rowCls = mobile
    ? "w-full flex items-center justify-between gap-3 py-3.5 text-left"
    : "w-full flex items-center justify-between gap-3 py-2 text-left";
  const textCls = mobile ? "text-base" : "text-sm";

  return (
    <div className="-mx-0.5 px-0.5">
      {/* Header / breadcrumb — показываем, только если зашли вглубь */}
      {stack.length > 0 && (
        <div
          className={cn(
            "flex items-center gap-2 border-b hairline",
            mobile ? "py-3" : "py-2.5",
          )}
        >
          <button
            type="button"
            onClick={back}
            className="inline-flex items-center gap-1 eyebrow text-foreground/70 hover:text-foreground"
          >
            <ChevronLeft className={mobile ? "size-4" : "size-3.5"} />
            <span className={mobile ? "text-xs" : "text-[11px]"}>Назад</span>
          </button>
          {current && (
            <span
              className={cn(
                "ml-auto truncate text-foreground/70",
                mobile ? "text-sm" : "text-xs",
              )}
              title={current.title}
            >
              {current.title}
            </span>
          )}
        </div>
      )}

      <ul className="divide-y hairline">
        {items.map((n) => {
          const isActive = n.id === activeId;
          const hasChildren = (n.items?.length ?? 0) > 0;
          return (
            <li key={n.id}>
              {hasChildren ? (
                <button
                  type="button"
                  onClick={() => push(n)}
                  className={cn(rowCls, "hover:bg-foreground/[0.03]")}
                >
                  <span className={cn(textCls, isActive ? "text-accent" : "text-foreground")}>
                    {n.title}
                  </span>
                  <ChevronRightIcon
                    className={cn(
                      mobile ? "size-4" : "size-3.5",
                      "text-foreground/40 shrink-0",
                    )}
                  />
                </button>
              ) : (
                <Link
                  to="/catalog/$gender/$section"
                  params={{ gender, section: n.slug }}
                  search={(prev: CatalogSearch) => prev}
                  onClick={onNavigate}
                  className={cn(rowCls, "hover:bg-foreground/[0.03]")}
                >
                  <span
                    className={cn(
                      textCls,
                      isActive ? "text-accent font-medium" : "text-foreground/90",
                    )}
                  >
                    {n.title}
                  </span>
                  {n.count > 0 && (
                    <span className="text-foreground/40 text-[11px] shrink-0">
                      {n.count}
                    </span>
                  )}
                </Link>
              )}
            </li>
          );
        })}

        {/* «Все · текущая ветка» — внизу */}
        {current && (
          <li>
            <Link
              to="/catalog/$gender/$section"
              params={{ gender, section: current.slug }}
              search={(prev: CatalogSearch) => prev}
              onClick={onNavigate}
              className={cn(
                rowCls,
                "hover:bg-foreground/[0.03]",
                activeId === current.id ? "text-accent" : "text-foreground/70",
              )}
            >
              <span className={cn(textCls, "italic")}>Все · {current.title}</span>
              {current.count > 0 && (
                <span className="text-foreground/40 text-[11px] shrink-0">
                  {current.count}
                </span>
              )}
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}

function hasDescendant(n: CategoryNode, id: number): boolean {
  if (n.id === id) return true;
  return n.items?.some((c) => hasDescendant(c, id)) ?? false;
}

function getSectionParamFromTree(roots: CategoryNode[], id: number): string | null {
  for (const r of roots) {
    const found = findInTree(r, id);
    if (found) return found.slug;
  }
  return null;
}

function getCategoryPath(roots: CategoryNode[], gender: Gender, activeId: number): CategoryNode[] {
  const genderRoot =
    roots.find((r) => r.title.toLowerCase().startsWith(gender === "women" ? "женск" : "мужск")) ??
    roots[gender === "men" ? 1 : 0];
  if (!genderRoot) return [];
  const dfs = (node: CategoryNode, trail: CategoryNode[]): CategoryNode[] | null => {
    const next = [...trail, node];
    if (node.id === activeId) return next;
    for (const child of node.items ?? []) {
      const found = dfs(child, next);
      if (found) return found;
    }
    return null;
  };
  for (const top of genderRoot.items ?? []) {
    const found = dfs(top, []);
    if (found) return found;
  }
  return [];
}

function findInTree(n: CategoryNode, id: number): CategoryNode | null {
  if (n.id === id) return n;
  for (const c of n.items ?? []) {
    const f = findInTree(c, id);
    if (f) return f;
  }
  return null;
}

// ────────────── PRICE FILTER ──────────────

function PriceFilter({
  min,
  max,
  from,
  to,
  onApply,
  mobile = false,
}: {
  min: number;
  max: number;
  from?: number;
  to?: number;
  onApply: (from?: number, to?: number) => void;
  mobile?: boolean;
}) {
  const [fromStr, setFromStr] = useState<string>(from != null ? String(from) : "");
  const [toStr, setToStr] = useState<string>(to != null ? String(to) : "");
  const [range, setRange] = useState<[number, number]>([from ?? min, to ?? max]);

  useEffect(() => {
    setFromStr(from != null ? String(from) : "");
    setToStr(to != null ? String(to) : "");
    setRange([from ?? min, to ?? max]);
  }, [from, to, min, max]);

  const parse = (s: string): number | undefined => {
    const digits = s.replace(/\D/g, "");
    if (!digits) return undefined;
    const n = Number(digits);
    return Number.isFinite(n) && n > 0 ? n : undefined;
  };

  const clamp = (n: number) => Math.max(min, Math.min(max, n));
  const applyValues = (f?: number, t?: number) => {
    let nf = f != null ? clamp(f) : undefined;
    let nt = t != null ? clamp(t) : undefined;
    if (nf != null && nt != null && nf > nt) [nf, nt] = [nt, nf];
    // Если совпадает с границами — считаем, что фильтр сброшен с этой стороны.
    if (nf != null && nf <= min) nf = undefined;
    if (nt != null && nt >= max) nt = undefined;
    onApply(nf, nt);
  };

  const applyFromInputs = () => {
    applyValues(parse(fromStr), parse(toStr));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      applyFromInputs();
    }
  };

  const step = Math.max(1, Math.round((max - min) / 100));

  const handleSliderChange = (v: number[]) => {
    const a = v[0] ?? min;
    const b = v[1] ?? max;
    setRange([a, b]);
    setFromStr(a > min ? String(a) : "");
    setToStr(b < max ? String(b) : "");
  };

  const handleSliderCommit = (v: number[]) => {
    const a = v[0] ?? min;
    const b = v[1] ?? max;
    applyValues(a > min ? a : undefined, b < max ? b : undefined);
  };

  const inputCls = cn(
    "w-full px-2 bg-transparent border border-foreground/20 focus:border-foreground focus:outline-none text-center",
    mobile ? "h-11 text-base" : "h-9 text-sm",
  );

  return (
    <div>
      <div className={cn("eyebrow text-foreground/60", mobile ? "text-xs mb-4" : "mb-3")}>
        Цена, ₽
      </div>
      <div className={cn(mobile ? "space-y-4" : "space-y-3")}>
        <div className="flex items-center gap-2">
          <input
            type="text"
            inputMode="numeric"
            placeholder={String(min)}
            value={fromStr}
            onChange={(e) => setFromStr(e.target.value.replace(/\D/g, ""))}
            onKeyDown={onKeyDown}
            onBlur={applyFromInputs}
            className={inputCls}
            aria-label="Цена от"
          />
          <span className="text-foreground/40">—</span>
          <input
            type="text"
            inputMode="numeric"
            placeholder={String(max)}
            value={toStr}
            onChange={(e) => setToStr(e.target.value.replace(/\D/g, ""))}
            onKeyDown={onKeyDown}
            onBlur={applyFromInputs}
            className={inputCls}
            aria-label="Цена до"
          />
        </div>
        <div className={cn(mobile ? "px-1.5 py-2" : "px-1 py-1.5")}>
          <Slider
            min={min}
            max={max}
            step={step}
            value={[Math.max(min, Math.min(max, range[0])), Math.max(min, Math.min(max, range[1]))]}
            onValueChange={handleSliderChange}
            onValueCommit={handleSliderCommit}
            aria-label="Диапазон цен"
          />
          <div
            className={cn(
              "flex justify-between text-foreground/50 mt-2",
              mobile ? "text-xs" : "text-[11px]",
            )}
          >
            <span>{formatRub(min)}</span>
            <span>{formatRub(max)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────── PAGINATION ──────────────

function PaginationStrip({
  page,
  pageCount,
  onJump,
}: {
  page: number;
  pageCount: number;
  onJump: (p: number) => void;
}) {
  const pages = useMemo(() => buildPages(page, pageCount), [page, pageCount]);
  const prevDisabled = page === 1;
  const nextDisabled = page === pageCount;
  return (
    <nav
      role="navigation"
      aria-label="Пагинация"
      className="mt-12 flex items-center justify-center gap-1 sm:gap-2 flex-wrap"
    >
      <button
        type="button"
        onClick={() => !prevDisabled && onJump(page - 1)}
        disabled={prevDisabled}
        aria-label="Предыдущая страница"
        className={cn(
          "h-9 px-2 sm:px-3 inline-flex items-center gap-1 text-sm hover:text-accent transition-colors",
          prevDisabled && "pointer-events-none opacity-40",
        )}
      >
        <ChevronLeft className="size-4" />
        <span className="hidden sm:inline">Назад</span>
      </button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span
            key={`e${i}`}
            aria-hidden
            className="h-9 w-6 sm:w-9 inline-flex items-center justify-center text-foreground/50"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onJump(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "h-9 min-w-9 px-2 inline-flex items-center justify-center text-sm transition-colors",
              p === page
                ? "border border-foreground/40 text-foreground"
                : "text-foreground/70 hover:text-accent",
            )}
          >
            {p}
          </button>
        ),
      )}
      <button
        type="button"
        onClick={() => !nextDisabled && onJump(page + 1)}
        disabled={nextDisabled}
        aria-label="Следующая страница"
        className={cn(
          "h-9 px-2 sm:px-3 inline-flex items-center gap-1 text-sm hover:text-accent transition-colors",
          nextDisabled && "pointer-events-none opacity-40",
        )}
      >
        <span className="hidden sm:inline">Вперед</span>
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
}

function buildPages(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const out: (number | "…")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) out.push("…");
  for (let i = start; i <= end; i++) out.push(i);
  if (end < total - 1) out.push("…");
  out.push(total);
  return out;
}

// ────────────── MOBILE SECTIONED FILTERS DRAWER ──────────────

type PanelKey = "sort" | "category" | "color" | "size" | "price" | `attr-${number}`;

function MobileFiltersDrawer({
  open,
  onOpenChange,
  gender,
  filters,
  categoryTree,
  activeSectionId,
  sectionTitle,
  search,
  total,
  currentSortTitle,
  onChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  gender: Gender;
  filters: TsumFilters;
  categoryTree?: CategoryNode[];
  activeSectionId?: number;
  sectionTitle?: string;
  search: CatalogSearch;
  total: number;
  currentSortTitle: string;
  onChange: (patch: Partial<CatalogSearch>, resetPage?: boolean) => void;
}) {
  const [panel, setPanel] = useState<PanelKey | null>(null);

  // Reset panel when closing
  useEffect(() => {
    if (!open) setPanel(null);
  }, [open]);

  const colors = useMemo(() => filters.color.items ?? [], [filters.color.items]);
  const sizes = useMemo(() => filters.size.items ?? [], [filters.size.items]);
  const attributes = useMemo(() => filters.attribute.items ?? [], [filters.attribute.items]);
  const priceBucket = filters.price.items?.[0];

  const activeColors = search.color ?? [];
  const activeSizes = search.size ?? [];

  const colorTitle = useMemo(() => {
    if (activeColors.length === 0) return "—";
    if (activeColors.length === 1) {
      return colors.find((x) => x.id === activeColors[0])?.title ?? "—";
    }
    return `Выбрано: ${activeColors.length}`;
  }, [colors, activeColors]);
  const sizeTitle = useMemo(() => {
    if (activeSizes.length === 0) return "—";
    if (activeSizes.length === 1) {
      return sizes.find((x) => x.id === activeSizes[0])?.title ?? "—";
    }
    return `Выбрано: ${activeSizes.length}`;
  }, [sizes, activeSizes]);
  const priceTitle = useMemo(() => {
    if (search.priceFrom != null || search.priceTo != null) {
      const f = search.priceFrom != null ? formatRub(search.priceFrom) : "0";
      const t = search.priceTo != null ? formatRub(search.priceTo) : "∞";
      return `${f} — ${t}`;
    }
    return "—";
  }, [search.priceFrom, search.priceTo]);

  const activeAttrs = search.attribute ?? [];

  const toggleAttr = (id: number) => {
    const set = new Set(activeAttrs);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    const next = Array.from(set);
    onChange({ attribute: next.length > 0 ? next : undefined });
  };
  const toggleColor = (id: number) => {
    const set = new Set(activeColors);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    const next = Array.from(set);
    onChange({ color: next.length > 0 ? next : undefined });
  };
  const toggleSize = (id: number) => {
    const set = new Set(activeSizes);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    const next = Array.from(set);
    onChange({ size: next.length > 0 ? next : undefined });
  };

  const hasAnyFilter =
    activeColors.length > 0 ||
    activeSizes.length > 0 ||
    !!search.priceFrom ||
    !!search.priceTo ||
    !!search.sort ||
    activeAttrs.length > 0;

  const resetAll = () => {
    onChange(
      {
        color: undefined,
        size: undefined,
        priceFrom: undefined,
        priceTo: undefined,
        sort: undefined,
        attribute: undefined,
      },
      true,
    );
  };

  const close = () => onOpenChange(false);
  const back = () => setPanel(null);

  const rows: { key: PanelKey; label: string; value: string }[] = [
    { key: "sort", label: "Сортировка", value: currentSortTitle },
    { key: "category", label: "Категории", value: sectionTitle ?? "Все" },
    ...(colors.length > 0 ? [{ key: "color" as PanelKey, label: "Цвет", value: colorTitle }] : []),
    ...(sizes.length > 0 ? [{ key: "size" as PanelKey, label: "Размер", value: sizeTitle }] : []),
    ...(priceBucket && priceBucket.min < priceBucket.max
      ? [{ key: "price" as PanelKey, label: "Цена", value: priceTitle }]
      : []),
    ...attributes.map((g) => {
      const selected = g.items.filter((a: AttrGroup) => activeAttrs.includes(a.id));
      const value =
        selected.length === 0
          ? "—"
          : selected.length === 1
            ? selected[0].title
            : `Выбрано: ${selected.length}`;
      return {
        key: `attr-${g.id}` as PanelKey,
        label: g.title,
        value,
      };
    }),
  ];

  const panelTitle = (() => {
    if (!panel) return "Фильтры";
    const r = rows.find((x) => x.key === panel);
    return r?.label ?? "Фильтр";
  })();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-screen sm:max-w-[440px] md:max-w-[520px] p-0 flex flex-col gap-0 [&>button.absolute]:hidden"
      >
        {/* Header */}
        <div className="relative h-14 shrink-0 flex items-center justify-center border-b hairline px-4">
          {panel ? (
            <button
              type="button"
              onClick={back}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 -m-2 text-foreground/70 hover:text-foreground"
              aria-label="Назад"
            >
              <ChevronLeft className="size-5" />
            </button>
          ) : null}
          <SheetTitle className="eyebrow text-sm tracking-[0.2em]">
            {panelTitle.toUpperCase()}
          </SheetTitle>
          <button
            type="button"
            onClick={close}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 -m-2 text-foreground/70 hover:text-foreground"
            aria-label="Закрыть"
          >
            <XIcon className="size-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {!panel && (
            <ul>
              {rows.map((r) => (
                <li key={r.key}>
                  <button
                    type="button"
                    onClick={() => setPanel(r.key)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-5 border-b hairline text-left hover:bg-foreground/[0.02]"
                  >
                    <span className="text-base text-foreground">{r.label}</span>
                    <span className="flex items-center gap-2 text-sm text-foreground/60 max-w-[55%] truncate">
                      <span className="truncate">{r.value}</span>
                      <ChevronRightIcon className="size-4 shrink-0 text-foreground/40" />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {panel === "sort" && (
            <ul>
              {(filters.sort?.items ?? []).map((s) => {
                const currentId = search.sort ?? "our";
                const active = currentId === s.id;
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange({ sort: s.id === "our" ? undefined : s.id });
                        back();
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-5 py-4 border-b hairline text-left",
                        active ? "text-accent" : "text-foreground hover:bg-foreground/[0.02]",
                      )}
                    >
                      <span className="text-base">{s.title}</span>
                      {active && <span className="text-xs eyebrow">выбрано</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {panel === "category" &&
            (() => {
              const source = categoryTree?.length ? categoryTree : filters.category.items;
              const genderRoot =
                source.find((r) =>
                  r.title.toLowerCase().startsWith(gender === "women" ? "женск" : "мужск"),
                ) ?? source[gender === "men" ? 1 : 0];
              const tree = genderRoot?.items ?? source;
              return (
                <div className="px-2">
                  <CategoryTree
                    nodes={tree}
                    gender={gender}
                    activeId={activeSectionId}
                    mobile
                    onNavigate={close}
                  />
                </div>
              );
            })()}

          {panel === "color" && (
            <div className="p-5">
              <ul className="space-y-1">
                {colors.map((c) => {
                  const active = activeColors.includes(c.id);
                  return (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => toggleColor(c.id)}
                        aria-pressed={active}
                        className={cn(
                          "w-full flex items-center justify-between gap-3 text-left py-2.5 transition-colors",
                          active ? "text-foreground" : "text-foreground/70",
                        )}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className={cn(
                              "inline-flex items-center justify-center size-5 border transition-colors shrink-0",
                              active
                                ? "bg-foreground border-foreground text-background"
                                : "border-foreground/30",
                            )}
                            aria-hidden="true"
                          >
                            {active && (
                              <svg
                                viewBox="0 0 12 12"
                                className="size-3.5 fill-none stroke-current stroke-2"
                              >
                                <polyline points="2,6 5,9 10,3" />
                              </svg>
                            )}
                          </span>
                          <span
                            className="size-6 rounded-full border border-foreground/20 shrink-0"
                            style={{
                              backgroundColor: c.hex ? `#${c.hex}` : undefined,
                              backgroundImage: c.imageUrl ? `url(${c.imageUrl})` : undefined,
                              backgroundSize: "cover",
                            }}
                            aria-hidden="true"
                          />
                          <span className="text-base">{c.title}</span>
                        </span>
                        <span className="text-foreground/40 text-xs">{c.count}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {panel === "size" && (
            <div className="p-5">
              <div className="grid grid-cols-4 gap-2">
                {sizes.map((s) => {
                  const active = activeSizes.includes(s.id);
                  const label = s.title.replace(/^RU\s*/i, "");
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleSize(s.id)}
                      className={cn(
                        "h-12 px-2 tracking-wider border transition-colors flex items-center justify-center text-sm",
                        active
                          ? "border-foreground bg-foreground text-background"
                          : "border-foreground/15 hover:border-foreground/60",
                      )}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {panel === "price" && priceBucket && (
            <div className="p-5">
              <PriceFilter
                min={priceBucket.min}
                max={priceBucket.max}
                from={search.priceFrom}
                to={search.priceTo}
                onApply={(f, t) => {
                  onChange({ priceFrom: f, priceTo: t });
                }}
                mobile
              />
            </div>
          )}

          {panel?.startsWith("attr-") &&
            (() => {
              const id = Number(panel.slice(5));
              const group = attributes.find((g) => g.id === id);
              if (!group) return null;
              return (
                <ul className="p-5 space-y-1">
                  {group.items.map((a: AttrGroup) => {
                    const checked = activeAttrs.includes(a.id);
                    return (
                      <li key={a.id}>
                        <button
                          type="button"
                          onClick={() => toggleAttr(a.id)}
                          aria-pressed={checked}
                          className={cn(
                            "w-full flex items-center justify-between text-left py-2.5 text-base transition-colors",
                            checked ? "text-foreground" : "text-foreground/70",
                          )}
                        >
                          <span className="flex items-center gap-3">
                            <span
                              className={cn(
                                "inline-flex items-center justify-center size-5 border transition-colors shrink-0",
                                checked
                                  ? "bg-foreground border-foreground text-background"
                                  : "border-foreground/30",
                              )}
                              aria-hidden="true"
                            >
                              {checked && (
                                <svg
                                  viewBox="0 0 12 12"
                                  className="size-3.5 fill-none stroke-current stroke-2"
                                >
                                  <polyline points="2,6 5,9 10,3" />
                                </svg>
                              )}
                            </span>
                            <span>{a.title}</span>
                          </span>
                          <span className="text-foreground/40 text-xs">{a.count}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              );
            })()}
        </div>

        {/* Sticky footer */}
        <div className="shrink-0 border-t hairline bg-background p-4 space-y-3">
          {hasAnyFilter && (
            <button
              type="button"
              onClick={resetAll}
              className="w-full text-center eyebrow text-foreground/60 hover:text-accent text-xs underline underline-offset-4"
            >
              Сбросить фильтры
            </button>
          )}
          <button
            type="button"
            onClick={close}
            className="w-full h-14 bg-foreground text-background eyebrow text-sm hover:bg-foreground/90 transition-colors"
          >
            Показать {total.toLocaleString("ru-RU")}{" "}
            {pluralizeRu(total, ["товар", "товара", "товаров"])}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
