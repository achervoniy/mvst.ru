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
  color?: number;
  size?: number;
  priceFrom?: number;
  priceTo?: number;
  label?: string | number;
  attribute?: number[];
}

function sanitizeSearch(next: CatalogSearch): CatalogSearch {
  const cleaned = { ...next };
  Object.keys(cleaned).forEach((k) => {
    const key = k as keyof CatalogSearch;
    if (cleaned[key] === undefined || cleaned[key] === "" || cleaned[key] === null) {
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
  total: number;
  page: number;
  pageCount: number;
  search: CatalogSearch;
}

export function CatalogPage(props: CatalogPageProps) {
  const { gender, title, sectionId, sectionTitle, items, filters, total, page, pageCount, search } =
    props;
  const navigate = useNavigate();
  const [optimisticSearch, setOptimisticSearch] = useState<CatalogSearch>(search);
  const [isNavigationPending, setIsNavigationPending] = useState(false);

  useEffect(() => {
    setOptimisticSearch(search);
    setIsNavigationPending(false);
  }, [search]);

  const displayedSearch = isNavigationPending ? optimisticSearch : search;

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
        <ol className="flex items-center px-4 md:px-10 eyebrow text-foreground/60 text-[10px]">
          <li>
            <Link to="/" className="hover:text-accent">
              Главная
            </Link>
          </li>
          <li className="flex items-center">
            <span className="mx-2">·</span>
            <Link to="/catalog/$gender" params={{ gender }} className="hover:text-accent">
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
          className="shrink-0 ml-2 inline-flex items-center justify-center h-10 w-10 border border-foreground/30 hover:border-foreground"
        >
          <SlidersHorizontal className="h-4 w-4" />
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
            className="h-12 w-12 inline-flex items-center justify-center border-l border-foreground/30 hover:border-foreground"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* Desktop sticky-бар */}
        <div className="hidden md:flex h-14 items-center justify-between max-w-[1360px] mx-auto px-12">
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
          </button>
        </div>
      </div>

      <div className="px-4 md:px-12 pb-16 max-w-[1360px] mx-auto w-full">
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 sm:gap-x-5 md:gap-x-6 gap-y-10 pt-4 md:pt-6">
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
  const hasAnyFilter =
    !!search.color ||
    !!search.size ||
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
              const active = search.color === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  title={`${c.title} (${c.count})`}
                  onClick={() => onChange({ color: active ? undefined : c.id })}
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
              const active = search.size === s.id;
              const label = s.title.replace(/^RU\s*/i, "");
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onChange({ size: active ? undefined : s.id })}
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

// ────────────── CATEGORY TREE ──────────────

function CategoryTree({
  nodes,
  gender,
  activeId,
  depth = 0,
  mobile = false,
  onNavigate,
}: {
  nodes: CategoryNode[];
  gender: Gender;
  activeId?: number;
  depth?: number;
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  const rootSpacing = mobile ? "space-y-3" : "space-y-1.5";
  const childSpacing = mobile
    ? "mt-2.5 ml-3 space-y-2.5 border-l hairline pl-4"
    : "mt-1.5 ml-3 space-y-1 border-l hairline pl-3";
  const linkSize = mobile ? "text-base py-0.5" : "text-sm";
  return (
    <ul className={cn(depth === 0 ? rootSpacing : childSpacing)}>
      {nodes.map((n) => {
        const active = n.id === activeId;
        const containsActive = activeId ? hasDescendant(n, activeId) : false;
        const open = depth < 1 || containsActive || active;
        return (
          <li key={n.id}>
            <Link
              to="/catalog/$gender/$section"
              params={{ gender, section: n.slug }}
              onClick={onNavigate}
              className={cn(
                "block hover:text-accent transition-colors",
                linkSize,
                active
                  ? "text-accent font-medium"
                  : containsActive
                    ? "text-foreground"
                    : "text-foreground/80",
              )}
            >
              {n.title}
            </Link>
            {open && n.items?.length > 0 && (
              <CategoryTree
                nodes={n.items}
                gender={gender}
                activeId={activeId}
                depth={depth + 1}
                mobile={mobile}
                onNavigate={onNavigate}
              />
            )}
          </li>
        );
      })}
    </ul>
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

  useEffect(() => {
    setFromStr(from != null ? String(from) : "");
    setToStr(to != null ? String(to) : "");
  }, [from, to]);

  const parse = (s: string): number | undefined => {
    const digits = s.replace(/\D/g, "");
    if (!digits) return undefined;
    const n = Number(digits);
    return Number.isFinite(n) && n > 0 ? n : undefined;
  };

  const apply = () => {
    let f = parse(fromStr);
    let t = parse(toStr);
    if (f != null && t != null && f > t) [f, t] = [t, f];
    onApply(f, t);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      apply();
    }
  };

  const currentFrom = from != null ? String(from) : "";
  const currentTo = to != null ? String(to) : "";
  const dirty = fromStr !== currentFrom || toStr !== currentTo;

  const labelTextCls = mobile
    ? "text-sm text-foreground/60 w-8 shrink-0"
    : "text-[11px] text-foreground/50 w-6 shrink-0";
  const inputCls = cn(
    "w-full px-2 bg-transparent border border-foreground/20 focus:border-foreground focus:outline-none",
    mobile ? "h-11 text-base" : "h-9 text-sm",
  );

  return (
    <div>
      <div className={cn("eyebrow text-foreground/60", mobile ? "text-xs mb-4" : "mb-3")}>
        Цена, ₽
      </div>
      <div className={cn(mobile ? "space-y-3" : "space-y-2")}>
        <label className="flex items-center gap-2">
          <span className={labelTextCls}>от</span>
          <input
            type="text"
            inputMode="numeric"
            placeholder={String(min)}
            value={fromStr}
            onChange={(e) => setFromStr(e.target.value.replace(/\D/g, ""))}
            onKeyDown={onKeyDown}
            onBlur={apply}
            className={inputCls}
            aria-label="Цена от"
          />
        </label>
        <label className="flex items-center gap-2">
          <span className={labelTextCls}>до</span>
          <input
            type="text"
            inputMode="numeric"
            placeholder={String(max)}
            value={toStr}
            onChange={(e) => setToStr(e.target.value.replace(/\D/g, ""))}
            onKeyDown={onKeyDown}
            onBlur={apply}
            className={inputCls}
            aria-label="Цена до"
          />
        </label>
      </div>
      <div className={cn("text-foreground/50 mt-2", mobile ? "text-xs" : "text-[11px]")}>
        {formatRub(min)} — {formatRub(max)}
      </div>
      {dirty && (
        <button
          type="button"
          onClick={apply}
          className={cn(
            "mt-3 w-full eyebrow border border-foreground/30 hover:border-foreground",
            mobile ? "h-11 text-sm" : "py-2",
          )}
        >
          Применить
        </button>
      )}
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
        <span className="hidden sm:inline">Вперёд</span>
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

  const colorTitle = useMemo(() => {
    const c = colors.find((x) => x.id === search.color);
    return c?.title ?? "—";
  }, [colors, search.color]);
  const sizeTitle = useMemo(() => {
    const s = sizes.find((x) => x.id === search.size);
    return s?.title ?? "—";
  }, [sizes, search.size]);
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

  const hasAnyFilter =
    !!search.color ||
    !!search.size ||
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

          {panel === "category" && (
            <div className="p-5">
              <FiltersSidebar
                gender={gender}
                filters={{
                  ...filters,
                  color: { ...filters.color, items: [] },
                  size: { ...filters.size, items: [] },
                  price: { ...filters.price, items: [] },
                  attribute: { ...filters.attribute, items: [] },
                }}
                activeSectionId={activeSectionId}
                search={search}
                onChange={(p, r) => {
                  onChange(p, r);
                }}
                onNavigate={close}
                mobile
              />
            </div>
          )}

          {panel === "color" && (
            <div className="p-5">
              <div className="flex flex-wrap gap-3">
                {colors.map((c) => {
                  const active = search.color === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      title={`${c.title} (${c.count})`}
                      onClick={() => {
                        onChange({ color: active ? undefined : c.id });
                        back();
                      }}
                      className={cn(
                        "rounded-full border transition-all size-10",
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

          {panel === "size" && (
            <div className="p-5">
              <div className="grid grid-cols-4 gap-2">
                {sizes.map((s) => {
                  const active = search.size === s.id;
                  const label = s.title.replace(/^RU\s*/i, "");
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        onChange({ size: active ? undefined : s.id });
                        back();
                      }}
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
