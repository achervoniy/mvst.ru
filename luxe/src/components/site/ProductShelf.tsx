import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRub } from "@/lib/format";

export type ShelfItem = {
  id: number;
  slug: string;
  title: string;
  image: string;
  price: number;
  originalPrice: number;
};

export function ProductShelf({
  title,
  items,
}: {
  title: string;
  items: ShelfItem[];
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
  }, [items]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-shelf-card]");
    const cardW = card?.getBoundingClientRect().width ?? el.clientWidth * 0.3;
    el.scrollBy({ left: dir * (cardW + 16), behavior: "smooth" });
  };

  if (!items.length) return null;

  return (
    <section className="px-6 md:px-12 pt-6 md:pt-10 pb-10 md:pb-14">
      <div className="flex items-end justify-between mb-4 md:mb-6 gap-4">
        <h2 className="font-serif text-2xl md:text-3xl leading-tight">
          {title}
        </h2>
        <div className="hidden md:flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="Прокрутить назад"
            disabled={!canLeft}
            className={cn(
              "size-10 flex items-center justify-center border border-foreground/30 hover:border-foreground transition-colors",
              !canLeft && "opacity-30 cursor-not-allowed hover:border-foreground/30",
            )}
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="Прокрутить вперёд"
            disabled={!canRight}
            className={cn(
              "size-10 flex items-center justify-center border border-foreground/30 hover:border-foreground transition-colors",
              !canRight && "opacity-30 cursor-not-allowed hover:border-foreground/30",
            )}
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>

      {/* Mobile: 2-col grid */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-6 md:hidden">
        {items.slice(0, 6).map((item) => (
          <ShelfCard key={item.id} item={item} variant="grid" />
        ))}
      </div>

      {/* Desktop: horizontal scroller */}
      <div className="hidden md:block">
        <div
          ref={scrollerRef}
          className="flex gap-4 overflow-x-auto snap-x scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item) => (
            <ShelfCard key={item.id} item={item} variant="scroll" />
          ))}
        </div>
      </div>
    </section>
  );
}

function ShelfCard({ item, variant = "scroll" }: { item: ShelfItem; variant?: "scroll" | "grid" }) {
  const hasDiscount = item.originalPrice > item.price && item.price > 0;
  return (
    <Link
      data-shelf-card
      to="/product/$slug"
      params={{ slug: item.slug }}
      className={cn(
        "group flex flex-col",
        variant === "scroll"
          ? "shrink-0 snap-start w-[44vw] sm:w-[32vw] md:w-[220px] lg:w-[240px]"
          : "w-full",
      )}
    >
      <div className="relative aspect-[3/4]">
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-contain p-2 md:p-6 mix-blend-multiply transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </div>
      <div className="pt-3 text-center">
        <div className="font-serif text-[15px] md:text-base leading-snug text-foreground line-clamp-2 min-h-[2.6em]">
          {item.title}
        </div>
        <div className="mt-1 text-xs text-foreground/80 tabular-nums">
          {formatRub(item.price)}
          {hasDiscount && (
            <span className="ml-2 text-foreground/40 line-through text-[10px]">
              {formatRub(item.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
