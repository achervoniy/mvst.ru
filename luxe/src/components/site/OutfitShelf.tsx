import { useEffect, useLayoutEffect, useRef, useState } from "react";
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

  const go = (dir: 1 | -1) => {
    setActive((i) => (((i + dir) % total) + total) % total);
  };

  return (
    <section className="px-6 md:px-12 pt-6 md:pt-10 pb-10 md:pb-14">
      <div className="flex items-end justify-between mb-4 md:mb-6 gap-4">
        <h2 className="font-serif text-2xl md:text-3xl leading-tight">{title}</h2>
        {total > 1 && (
          // На мобиле счётчик+стрелки прячем — навигация идёт через свайп фото и
          // стрелки поверх кадра (как на странице коллекции).
          <div className="hidden md:flex items-center gap-4 md:gap-5">
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
        outfits={outfits}
        active={safeIndex}
        onPrev={() => go(-1)}
        onNext={() => go(1)}
        currentItemId={currentItemId}
      />
    </section>
  );
}

function OutfitStage({
  outfits,
  active,
  onPrev,
  onNext,
  currentItemId,
}: {
  outfits: LookOutfit[];
  active: number;
  onPrev: () => void;
  onNext: () => void;
  currentItemId: number;
}) {
  const outfit = outfits[active];
  const total = outfits.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[auto_minmax(0,1fr)] gap-3 md:gap-4">
      {/* Mobile: свайпер с физикой пальца и стрелками поверх фото */}
      <div className="md:hidden">
        <MobileOutfitSwiper
          outfits={outfits}
          active={active}
          total={total}
          onPrev={onPrev}
          onNext={onNext}
        />
      </div>

      {/* Desktop: статичное модельное фото */}
      <div className="hidden md:block relative md:h-[72vh] md:aspect-auto md:w-[calc(72vh*11/17)] overflow-hidden">
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

const SWIPE_EASE = "cubic-bezier(0.22, 0.61, 0.36, 1)";
const SWIPE_DURATION = 420;
const SWIPE_THRESHOLD_FRACTION = 0.22;
const SWIPE_FLICK_VELOCITY = 0.45;

function MobileOutfitSwiper({
  outfits,
  active,
  total,
  onPrev,
  onNext,
}: {
  outfits: LookOutfit[];
  active: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  const curr = outfits[active];
  const prev = outfits[(active - 1 + total) % total];
  const next = outfits[(active + 1) % total];

  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const startT = useRef(0);
  const horizontalRef = useRef(false);
  const dragRef = useRef(0);
  const widthRef = useRef(0);
  const animatingRef = useRef(false);
  const [width, setWidth] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    widthRef.current = width;
  }, [width]);
  useEffect(() => {
    animatingRef.current = animating;
  }, [animating]);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Нативные touch-listeners с passive:false — нужны, чтобы preventDefault на
  // touchmove блокировал вертикальный скролл страницы, как только направление
  // жеста зафиксировано как горизонтальное.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || total < 2) return;

    const onTouchStart = (e: TouchEvent) => {
      if (animatingRef.current) return;
      startX.current = e.touches[0].clientX;
      startY.current = e.touches[0].clientY;
      startT.current = performance.now();
      horizontalRef.current = false;
      dragRef.current = 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (startX.current === null || animatingRef.current) return;
      const dx = e.touches[0].clientX - startX.current;
      const dy = e.touches[0].clientY - (startY.current ?? 0);
      if (!horizontalRef.current) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        if (Math.abs(dy) > Math.abs(dx)) {
          startX.current = null;
          return;
        }
        horizontalRef.current = true;
      }
      if (e.cancelable) e.preventDefault();
      dragRef.current = dx;
      setDragX(dx);
    };

    const onTouchEnd = () => {
      if (startX.current === null) {
        horizontalRef.current = false;
        return;
      }
      const wasHorizontal = horizontalRef.current;
      const dx = dragRef.current;
      const dt = performance.now() - startT.current;
      const v = Math.abs(dx) / Math.max(dt, 1);
      startX.current = null;
      startY.current = null;
      horizontalRef.current = false;
      if (!wasHorizontal) return;
      const w = widthRef.current || 1;
      const commit = Math.abs(dx) > w * SWIPE_THRESHOLD_FRACTION || v > SWIPE_FLICK_VELOCITY;
      if (!commit) {
        setAnimating(true);
        setDragX(0);
        return;
      }
      const dir: 1 | -1 = dx < 0 ? 1 : -1;
      setAnimating(true);
      setDragX(dir === 1 ? -w : w);
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("touchcancel", onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [total]);

  const triggerNav = (dir: 1 | -1) => {
    if (animating || width === 0 || total < 2) return;
    setAnimating(true);
    setDragX(dir === 1 ? -width : width);
  };

  const onTransitionEnd = (e: React.TransitionEvent) => {
    if (e.propertyName !== "transform" || !animating) return;
    const w = width || 1;
    if (Math.abs(dragX) >= w - 0.5) {
      const dir = dragX < 0 ? 1 : -1;
      // Порядок важен: setDragX(0) + смена active батчатся, и трек одновременно
      // снэпится с -2W обратно на -W, а слайды смещаются — старая «следующая»
      // картинка остаётся ровно в том же месте кадра. Без вспышек.
      setAnimating(false);
      setDragX(0);
      if (dir === 1) onNext();
      else onPrev();
    } else {
      setAnimating(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-[11/17] overflow-hidden"
      style={{ touchAction: "pan-y" }}
    >
      <div
        onTransitionEnd={onTransitionEnd}
        className="absolute inset-0 flex will-change-transform"
        style={{
          transform: `translate3d(${-width + dragX}px, 0, 0)`,
          transition: animating ? `transform ${SWIPE_DURATION}ms ${SWIPE_EASE}` : "none",
        }}
      >
        <MobileOutfitSlide outfit={prev} />
        <MobileOutfitSlide outfit={curr} />
        <MobileOutfitSlide outfit={next} />
      </div>

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={() => triggerNav(-1)}
            aria-label="Предыдущий образ"
            className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 p-2 text-foreground/70 [filter:drop-shadow(0_1px_2px_rgb(0_0_0/0.15))]"
          >
            <ChevronLeft className="size-7" strokeWidth={1.25} />
          </button>
          <button
            type="button"
            onClick={() => triggerNav(1)}
            aria-label="Следующий образ"
            className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 p-2 text-foreground/70 [filter:drop-shadow(0_1px_2px_rgb(0_0_0/0.15))]"
          >
            <ChevronRight className="size-7" strokeWidth={1.25} />
          </button>

          <div className="absolute bottom-3 right-3 z-10 font-serif text-xs tabular-nums text-cream bg-foreground/40 backdrop-blur px-2 py-1 rounded-full">
            {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </div>
        </>
      )}
    </div>
  );
}

function MobileOutfitSlide({ outfit }: { outfit: LookOutfit }) {
  return (
    <div className="relative w-full h-full shrink-0">
      <img
        src={outfit.image}
        alt={`Образ ${outfit.sort}`}
        draggable={false}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 size-full object-contain p-2 pointer-events-none select-none"
      />
    </div>
  );
}

const TILE_GAP = 16;
const TILE_MIN = 160;
const TILE_MAX = 280;
const TILE_SCROLL_LG = 240;
const TILE_SCROLL_MD = 220;
const FIT_MAX_COUNT = 4;

function OutfitCarousel({
  products,
  currentItemId,
}: {
  products: ShelfItem[];
  currentItemId: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [tileW, setTileW] = useState<number | null>(null);
  const [fits, setFits] = useState(true);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !products.length) return;
    const compute = () => {
      const w = el.clientWidth;
      if (w === 0) return;
      const n = products.length;
      const idealW = (w - TILE_GAP * (n - 1)) / n;
      // До 4 товаров включительно — растягиваем на всю ширину. С 5-го — скролл.
      if (n <= FIT_MAX_COUNT && idealW >= TILE_MIN) {
        setFits(true);
        setTileW(Math.min(idealW, TILE_MAX));
      } else {
        setFits(false);
        setTileW(window.innerWidth < 1024 ? TILE_SCROLL_MD : TILE_SCROLL_LG);
      }
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [products]);

  useEffect(() => {
    if (fits) {
      setCanLeft(false);
      setCanRight(false);
      return;
    }
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
  }, [fits, products]);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ left: 0, behavior: "auto" });
  }, [products]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el || !tileW) return;
    el.scrollBy({ left: dir * (tileW + TILE_GAP), behavior: "smooth" });
  };

  const centerRow = fits && tileW === TILE_MAX;

  return (
    <div ref={wrapRef} className="relative w-full min-w-0">
      {fits ? (
        <div
          className={cn("flex gap-4 w-full", centerRow ? "justify-center" : "justify-start")}
        >
          {products.map((item) => (
            <div
              key={item.id}
              style={{ width: tileW ?? undefined }}
              className="shrink-0"
            >
              <OutfitCard item={item} isCurrent={item.id === currentItemId} />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div
            ref={scrollerRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {products.map((item) => (
              <div
                key={item.id}
                style={{ width: tileW ?? undefined }}
                className="shrink-0 snap-start"
              >
                <OutfitCard item={item} isCurrent={item.id === currentItemId} />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="Предыдущие товары"
            className={cn(
              "absolute left-1 top-1/2 -translate-y-1/2 z-20 size-10 flex items-center justify-center rounded-full bg-cream/95 backdrop-blur hairline border hover:bg-cream transition-opacity",
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
              "absolute right-1 top-1/2 -translate-y-1/2 z-20 size-10 flex items-center justify-center rounded-full bg-cream/95 backdrop-blur hairline border hover:bg-cream transition-opacity",
              canRight ? "opacity-100" : "opacity-0 pointer-events-none",
            )}
          >
            <ChevronRight className="size-5" />
          </button>
        </>
      )}
    </div>
  );
}

function OutfitCard({
  item,
  isCurrent,
}: {
  item: ShelfItem;
  isCurrent: boolean;
}) {
  const hasDiscount = item.originalPrice > item.price && item.price > 0;
  const wrapperClass = "group flex flex-col text-left w-full";

  const inner = (
    <>
      <div className="relative aspect-[3/4] bg-background isolate">
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
      to="/product/$slug"
      params={{ slug: item.slug }}
      className={wrapperClass}
    >
      {inner}
    </Link>
  );
}
