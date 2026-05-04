import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { cn } from "@/lib/utils";
import looksData from "@/data/looks.json";
import type { Collection, Look, Product } from "@/types/looks";
import { formatPrice } from "@/types/looks";
import heroSs26 from "@/assets/hero-ss26.webp";

const collection = looksData as unknown as Collection;

export const Route = createFileRoute("/collection-ss26")({
  head: () => ({
    meta: [
      { title: `Коллекция ${collection.title} — MVST` },
      {
        name: "description",
        content:
          "Лукбук коллекции MVST SS'26. 158 образов: кожа, шёлк, лён и японский деним. Архитектурные силуэты и природная палитра.",
      },
      { property: "og:title", content: `Коллекция ${collection.title} — MVST` },
      {
        property: "og:description",
        content: "Editorial-лукбук MVST Весна–Лето 26 — 158 образов сезона.",
      },
      { property: "og:image", content: heroSs26 },
      { property: "twitter:image", content: heroSs26 },
    ],
  }),
  component: CollectionSS26,
});

function CollectionSS26() {
  const looks = collection.looks;
  const [active, setActive] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const total = looks.length;
  const current = looks[active];

  const goTo = useCallback(
    (i: number) => {
      const next = ((i % total) + total) % total;
      setActive(next);
    },
    [total],
  );

  // Center the active thumbnail in the strip
  useEffect(() => {
    const el = thumbRefs.current[active];
    const strip = stripRef.current;
    if (!el || !strip) return;
    const target = el.offsetLeft - strip.clientWidth / 2 + el.clientWidth / 2;
    strip.scrollTo({ left: target, behavior: "smooth" });
  }, [active]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo(active - 1);
      else if (e.key === "ArrowRight") goTo(active + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, goTo]);

  const description = useMemo(() => collection.description.split(/\n\n+/).filter(Boolean), []);

  return (
    <SiteLayout transparentHeader>
      {/* Cover */}
      <section
        data-hero
        className="relative h-[72vh] min-h-[520px] md:h-[88vh] md:min-h-[640px] overflow-hidden"
      >
        <img
          src={heroSs26}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 size-full object-cover object-[50%_16%] md:object-[50%_12%] xl:object-[50%_8%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/35" />
        <div className="relative z-10 h-full flex flex-col items-center justify-end pb-20 px-6 text-center text-cream">
          <div className="eyebrow-lg mb-6 opacity-90">Лукбук · Весна–Лето 26</div>
          <h1 className="font-serif text-5xl md:text-7xl font-light leading-[1.05]">
            Коллекция SS26
          </h1>
          <p className="mt-6 max-w-md text-sm md:text-base opacity-90">
            {total} образов нового сезона — кожа, шёлк, лён и японский деним.
          </p>
        </div>
      </section>

      {/* Intro paragraph */}
      <section className="py-20 md:py-24 px-6 max-w-2xl mx-auto text-center">
        <div className="eyebrow text-foreground/60 mb-6">О коллекции</div>
        <p className="font-serif text-2xl md:text-[28px] leading-[1.4] text-foreground">
          {description[0]}
        </p>
      </section>

      {/* Lookbook stage — compact, fits a laptop screen */}
      <section className="bg-cream/60 border-y hairline">
        <div className="px-4 md:px-8 pt-6 md:pt-8 pb-3 flex items-end justify-between max-w-[1360px] mx-auto">
          <div className="eyebrow text-foreground/60">Образ</div>
          <div className="font-serif text-sm tabular-nums text-foreground/70">
            <span className="text-foreground">{String(active + 1).padStart(2, "0")}</span>
            <span className="mx-2 text-foreground/30">/</span>
            <span>{String(total).padStart(2, "0")}</span>
          </div>
        </div>

        <LookStage look={current} onPrev={() => goTo(active - 1)} onNext={() => goTo(active + 1)} />

        {/* Thumbnails strip */}
        <div className="relative max-w-[1360px] mx-auto px-2 md:px-6 pb-6 md:pb-8 pt-5">
          <div
            ref={stripRef}
            className="flex gap-2.5 md:gap-3 overflow-x-auto scrollbar-none scroll-smooth snap-x"
            style={{ scrollbarWidth: "none" }}
          >
            {looks.map((l, i) => (
              <button
                key={l.id}
                ref={(el) => {
                  thumbRefs.current[i] = el;
                }}
                onClick={() => goTo(i)}
                aria-label={`Образ ${i + 1}`}
                className={cn(
                  "shrink-0 snap-start relative w-16 h-24 md:w-20 md:h-28 overflow-hidden bg-sand transition-opacity",
                  i === active ? "opacity-100" : "opacity-55 hover:opacity-100",
                )}
              >
                <img
                  src={l.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 size-full object-cover"
                />
                <span
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute inset-0 border-2 transition-colors",
                    i === active ? "border-accent" : "border-transparent",
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 px-6 text-center">
        <div className="eyebrow text-foreground/60 mb-6">Каталог</div>
        <h2 className="font-serif text-4xl md:text-5xl mb-10">Перейти к вещам коллекции</h2>
        <div className="flex justify-center gap-10">
          <Link
            to="/catalog/$gender"
            params={{ gender: "women" }}
            preload="intent"
            className="eyebrow-lg border-b border-foreground pb-2 hover:text-accent hover:border-accent transition-colors"
          >
            Для неё
          </Link>
          <Link
            to="/catalog/$gender"
            params={{ gender: "men" }}
            preload="intent"
            className="eyebrow-lg border-b border-foreground pb-2 hover:text-accent hover:border-accent transition-colors"
          >
            Для него
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}

function LookStage({
  look,
  onPrev,
  onNext,
}: {
  look: Look;
  onPrev: () => void;
  onNext: () => void;
}) {
  // Touch swipe for mobile
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;
    if (Math.abs(dx) < 50 || Math.abs(dy) > Math.abs(dx)) return;
    if (dx < 0) onNext();
    else onPrev();
  };

  return (
    <div className="relative max-w-[1360px] mx-auto px-2 md:px-6">
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] gap-3 md:gap-4">
        {/* Look image */}
        <div
          className="relative bg-cream aspect-[3/4] md:aspect-[3/4] md:max-h-[64vh] overflow-hidden touch-pan-y"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <img
            key={look.image}
            src={look.image}
            alt={`Образ ${look.sort}`}
            className="absolute inset-0 size-full object-contain look-fade"
          />
          {/* Mobile counter overlay */}
          <div className="md:hidden absolute bottom-3 right-3 font-serif text-xs tabular-nums text-cream bg-foreground/40 backdrop-blur px-2 py-1 rounded-full">
            {String(look.sort).padStart(2, "0")} /{" "}
            {String(collection.looks.length).padStart(2, "0")}
          </div>
        </div>

        {/* Products slider — single horizontal row, MVST-only */}
        <div
          key={look.id}
          className="look-fade md:h-full md:max-h-[64vh] flex items-center min-w-0"
        >
          <ProductsSlider products={look.products.filter((p) => p.brand === "MVST")} />
        </div>
      </div>
    </div>
  );
}

function ProductsSlider({ products }: { products: Product[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      setCanLeft(el.scrollLeft > 4);
      setCanRight(el.scrollLeft < max - 4);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [products]);

  // Reset to start on look change
  useEffect(() => {
    scrollerRef.current?.scrollTo({ left: 0, behavior: "auto" });
  }, [products]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-product-card]");
    const cardW = card?.getBoundingClientRect().width ?? el.clientWidth * 0.3;
    el.scrollBy({ left: dir * (cardW + 16), behavior: "smooth" });
  };

  if (!products.length) {
    return (
      <div className="w-full h-full min-h-[300px] flex items-center justify-center text-foreground/50 text-sm">
        Товары скоро появятся
      </div>
    );
  }

  return (
    <div className="relative w-full min-w-0">
      <div
        ref={scrollerRef}
        className="flex gap-3 md:gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((p) => (
          <ProductCell key={p.itemId} product={p} />
        ))}
      </div>

      {/* Desktop slider arrows */}
      <button
        type="button"
        onClick={() => scrollByCard(-1)}
        aria-label="Предыдущие товары"
        className={cn(
          "hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-20 size-10 items-center justify-center rounded-full bg-cream/95 backdrop-blur hairline border hover:bg-cream transition-opacity",
          canLeft ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        onClick={() => scrollByCard(1)}
        aria-label="Следующие товары"
        className={cn(
          "hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 size-10 items-center justify-center rounded-full bg-cream/95 backdrop-blur hairline border hover:bg-cream transition-opacity",
          canRight ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}

function ProductCell({ product }: { product: Product }) {
  return (
    <Link
      data-product-card
      to="/product/$slug"
      params={{ slug: product.slug }}
      className="group shrink-0 snap-start w-[60vw] sm:w-[40vw] md:w-[200px] lg:w-[215px] flex flex-col bg-cream transition-all"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={product.imageSmall}
          alt={product.title}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-contain p-3 transition-transform duration-700 group-hover:scale-[1.03] mix-blend-multiply"
        />
      </div>
      <div className="px-3 pt-3 pb-4 flex flex-col items-center gap-1.5 text-center">
        <div className="text-sm leading-tight text-foreground/85 line-clamp-1">{product.title}</div>
        <div className="text-sm font-light text-foreground tabular-nums">
          {formatPrice(product.price.discounted)}
        </div>
      </div>
    </Link>
  );
}
