import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/site/ProductCard";
import type { CatalogProduct } from "@/lib/tsum/types";
import { cn } from "@/lib/utils";

interface ProductCarouselProps {
  items: CatalogProduct[];
  viewAllGender: "women" | "men";
}

export function ProductCarousel({ items, viewAllGender }: ProductCarouselProps) {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      setCanScrollLeft(el.scrollLeft > 4);
      setCanScrollRight(el.scrollLeft < max - 4);
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

  // Reset scroll when items change (tab switch)
  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollTo({ left: 0, behavior: "auto" });
  }, [items]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const firstCard = el.querySelector<HTMLLIElement>("li");
    const cardWidth = firstCard?.getBoundingClientRect().width ?? el.clientWidth * 0.25;
    const gap = 24;
    el.scrollBy({ left: dir * (cardWidth + gap), behavior: "smooth" });
  };

  if (!items.length) return null;

  return (
    <div className="relative">
      {/* Desktop arrows */}
      <button
        type="button"
        aria-label="Назад"
        onClick={() => scrollByCard(-1)}
        className={cn(
          "hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 size-11 items-center justify-center rounded-full bg-background/90 border hairline shadow-sm transition-opacity duration-200 hover:bg-background",
          canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        aria-label="Вперёд"
        onClick={() => scrollByCard(1)}
        className={cn(
          "hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 size-11 items-center justify-center rounded-full bg-background/90 border hairline shadow-sm transition-opacity duration-200 hover:bg-background",
          canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        <ChevronRight className="size-5" />
      </button>

      <ul
        ref={scrollerRef}
        className="-mx-6 md:mx-0 px-6 md:px-0 flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth bg-background isolate [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((p) => (
          <li
            key={p.id}
            className="shrink-0 snap-start w-[72%] sm:w-[42%] md:w-[calc((100%-3rem)/3)] lg:w-[calc((100%-4.5rem)/4)]"
          >
            <ProductCard product={p} />
          </li>
        ))}
      </ul>

      <div className="mt-10 text-center">
        <Link
          to="/catalog/$gender"
          params={{ gender: viewAllGender }}
          preload="intent"
          className="eyebrow border-b border-foreground pb-1 hover:text-accent hover:border-accent"
        >
          Смотреть все
        </Link>
      </div>
    </div>
  );
}
