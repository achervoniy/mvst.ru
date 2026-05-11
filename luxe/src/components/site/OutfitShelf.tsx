import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRub } from "@/lib/format";
import type { LookOutfit, ShelfItem } from "@/lib/look-recommendations";

export function OutfitShelf({
  title,
  outfits,
  currentItemId,
}: {
  title: string;
  outfits: LookOutfit[];
  currentItemId: number;
}) {
  const [active, setActive] = useState(0);
  const total = outfits.length;

  if (total === 0) return null;
  const safeIndex = Math.min(active, total - 1);
  const current = outfits[safeIndex];

  const go = (dir: 1 | -1) => {
    setActive((i) => (((i + dir) % total) + total) % total);
  };

  return (
    <section className="px-6 md:px-12 pt-6 md:pt-10 pb-10 md:pb-14">
      <div className="flex items-end justify-between mb-4 md:mb-6 gap-4">
        <h2 className="font-serif text-2xl md:text-3xl leading-tight">{title}</h2>
        {total > 1 && (
          <div className="flex items-center gap-4 md:gap-5">
            <div className="font-serif text-sm tabular-nums text-foreground/70">
              <span className="text-foreground">
                {String(safeIndex + 1).padStart(2, "0")}
              </span>
              <span className="mx-2 text-foreground/30">/</span>
              <span>{String(total).padStart(2, "0")}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Предыдущий образ"
                className="size-10 flex items-center justify-center border border-foreground/30 hover:border-foreground transition-colors"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Следующий образ"
                className="size-10 flex items-center justify-center border border-foreground/30 hover:border-foreground transition-colors"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      <OutfitStage
        outfit={current}
        onPrev={() => go(-1)}
        onNext={() => go(1)}
        showSwipe={total > 1}
        currentItemId={currentItemId}
      />
    </section>
  );
}

function OutfitStage({
  outfit,
  onPrev,
  onNext,
  showSwipe,
  currentItemId,
}: {
  outfit: LookOutfit;
  onPrev: () => void;
  onNext: () => void;
  showSwipe: boolean;
  currentItemId: number;
}) {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    if (!showSwipe) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!showSwipe) return;
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
    <div className="grid grid-cols-1 md:grid-cols-[auto_minmax(0,1fr)] gap-3 md:gap-4">
      {/* Model photo */}
      <div
        className="relative aspect-[11/17] md:h-[72vh] md:aspect-auto md:w-[calc(72vh*11/17)] overflow-hidden touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <img
          key={outfit.image}
          src={outfit.image}
          alt={`Образ ${outfit.sort}`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-contain p-2 md:p-6 look-fade"
        />
      </div>

      {/* Products: 2-col grid on mobile, horizontal carousel on desktop.
          NB: не оборачиваем в opacity-анимацию — она создаёт compositing layer
          и ломает mix-blend-multiply на изображениях товаров. */}
      <div
        key={outfit.lookId}
        className="md:h-[72vh] flex items-center min-w-0"
      >
        <div className="md:hidden grid grid-cols-2 gap-x-3 gap-y-6 w-full pt-2">
          {outfit.products.map((item) => (
            <OutfitCard
              key={item.id}
              item={item}
              variant="grid"
              isCurrent={item.id === currentItemId}
            />
          ))}
        </div>
        <div className="hidden md:block w-full min-w-0">
          <OutfitCarousel products={outfit.products} currentItemId={currentItemId} />
        </div>
      </div>
    </div>
  );
}

function OutfitCarousel({
  products,
  currentItemId,
}: {
  products: ShelfItem[];
  currentItemId: number;
}) {
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

  useEffect(() => {
    scrollerRef.current?.scrollTo({ left: 0, behavior: "auto" });
  }, [products]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-outfit-card]");
    const cardW = card?.getBoundingClientRect().width ?? el.clientWidth * 0.3;
    el.scrollBy({ left: dir * (cardW + 16), behavior: "smooth" });
  };

  return (
    <div className="relative w-full min-w-0">
      <div
        ref={scrollerRef}
        className="overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex gap-3 md:gap-4 w-max mx-auto">
          {products.map((item) => (
            <OutfitCard
              key={item.id}
              item={item}
              variant="scroll"
              isCurrent={item.id === currentItemId}
            />
          ))}
        </div>
      </div>

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

function OutfitCard({
  item,
  variant,
  isCurrent,
}: {
  item: ShelfItem;
  variant: "scroll" | "grid";
  isCurrent: boolean;
}) {
  const hasDiscount = item.originalPrice > item.price && item.price > 0;
  const wrapperClass = cn(
    "group flex flex-col text-left",
    variant === "scroll"
      ? "shrink-0 snap-start w-[60vw] sm:w-[40vw] md:w-[220px] lg:w-[240px]"
      : "w-full",
  );

  const inner = (
    <>
      <div className="relative aspect-[3/4]">
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-contain p-2 md:p-6 transition-transform duration-700 group-hover:scale-[1.03] mix-blend-multiply"
        />
      </div>
      <div className="px-2 md:px-3 pt-3 pb-1 md:pb-4 flex flex-col items-center gap-1.5 text-center">
        <div className="font-serif text-[15px] md:text-base leading-snug line-clamp-2 min-h-[2.6em] text-foreground">
          {item.title}
        </div>
        <div className="text-xs text-foreground/80 tabular-nums">
          {formatRub(item.price)}
          {hasDiscount && (
            <span className="ml-2 text-foreground/40 line-through text-[10px]">
              {formatRub(item.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </>
  );

  if (isCurrent) {
    return (
      <button
        data-outfit-card
        type="button"
        aria-label={`${item.title} — текущий товар, прокрутить наверх`}
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className={cn(wrapperClass, "cursor-pointer")}
      >
        {inner}
      </button>
    );
  }

  return (
    <Link
      data-outfit-card
      to="/product/$slug"
      params={{ slug: item.slug }}
      className={wrapperClass}
    >
      {inner}
    </Link>
  );
}
