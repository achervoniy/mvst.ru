import { Link } from "@tanstack/react-router";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type TransitionEvent,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Look, Product } from "@/types/looks";
import { formatPrice } from "@/types/looks";

// Интерактивный лукбук-стейдж: фото образа слева, товары справа,
// превью-полоса снизу на десктопе, свайпер на мобиле.
// Использовался только в /collection-ss26, теперь шарится с /fashion-show.
export function LookbookStage({
  looks,
  showLabel = true,
  labelText = "Образ",
  className,
}: {
  looks: Look[];
  showLabel?: boolean;
  labelText?: string;
  className?: string;
}) {
  const [active, setActive] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const total = looks.length;

  const goTo = useCallback(
    (i: number) => {
      const next = ((i % total) + total) % total;
      setActive(next);
    },
    [total],
  );

  // Центрируем активный thumb в превью-полосе
  useEffect(() => {
    const el = thumbRefs.current[active];
    const strip = stripRef.current;
    if (!el || !strip) return;
    const target = el.offsetLeft - strip.clientWidth / 2 + el.clientWidth / 2;
    strip.scrollTo({ left: target, behavior: "smooth" });
  }, [active]);

  // Клавиатурная навигация
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo(active - 1);
      else if (e.key === "ArrowRight") goTo(active + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, goTo]);

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex items-baseline justify-center md:justify-start gap-3 px-4 md:px-8 pt-6 md:pt-10 pb-3 max-w-[1360px] mx-auto">
          <div className="eyebrow text-foreground/60">{labelText}</div>
        </div>
      )}

      <LookStage
        looks={looks}
        active={active}
        onPrev={() => goTo(active - 1)}
        onNext={() => goTo(active + 1)}
      />

      {/* Thumbnails strip — только на десктопе. На мобилке навигация через свайп. */}
      <div className="hidden md:block relative max-w-[1360px] mx-auto px-2 md:px-6 pb-6 md:pb-8 pt-5">
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
    </div>
  );
}

function LookStage({
  looks,
  active,
  onPrev,
  onNext,
}: {
  looks: Look[];
  active: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  const look = looks[active];

  // Сигнатура товаров — sorted ids. Если у соседних образов одинаковый
  // набор товаров, key не меняется → блок справа не перемонтируется и
  // не моргает (исчезает fade-in анимация).
  const productsKey = useMemo(() => {
    return look.products
      .filter((p) => p.brand === "MVST")
      .map((p) => p.itemId)
      .sort((a, b) => a - b)
      .join(",");
  }, [look.products]);

  // Кэшируем массив товаров по productsKey — чтобы reference оставался тем же
  // при идентичном составе, и ProductsSlider не сбрасывал скролл.
  const mvstProducts = useMemo(
    () => look.products.filter((p) => p.brand === "MVST"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [productsKey],
  );

  return (
    <div className="relative max-w-[1360px] mx-auto md:px-6 pt-2 md:pt-0">
      <div className="grid grid-cols-1 gap-4 md:gap-4 md:flex md:items-stretch md:h-[64vh] md:max-h-[640px]">
        {/* Mobile: свайпер на всю ширину */}
        <div className="md:hidden">
          <MobileLookSwiper looks={looks} active={active} onPrev={onPrev} onNext={onNext} />
        </div>

        {/* Desktop: одна модельная картинка */}
        <div className="hidden md:block relative bg-cream md:aspect-[3/4] md:h-full md:w-auto md:shrink-0 md:overflow-hidden">
          <img
            key={look.image}
            src={look.image}
            alt={`Образ ${look.sort}`}
            className="absolute inset-0 size-full object-contain look-fade"
          />
        </div>

        {/* Товары образа. key = productsKey, не look.id — поэтому
            при одинаковом составе блок переиспользуется без перемонтажа. */}
        <div
          key={productsKey}
          className="look-fade md:flex-1 md:h-full flex items-center min-w-0 px-2 md:px-0"
        >
          <ProductsSlider products={mvstProducts} />
        </div>
      </div>
    </div>
  );
}

const SWIPE_EASE = "cubic-bezier(0.22, 0.61, 0.36, 1)";
const SWIPE_DURATION = 420;
const SWIPE_THRESHOLD_FRACTION = 0.22;
const SWIPE_FLICK_VELOCITY = 0.45;

function MobileLookSwiper({
  looks,
  active,
  onPrev,
  onNext,
}: {
  looks: Look[];
  active: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  const total = looks.length;
  const curr = looks[active];
  const prev = looks[(active - 1 + total) % total];
  const next = looks[(active + 1) % total];

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

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

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
  }, []);

  const triggerNav = (dir: 1 | -1) => {
    if (animating || width === 0) return;
    setAnimating(true);
    setDragX(dir === 1 ? -width : width);
  };

  const onTransitionEnd = (e: TransitionEvent) => {
    if (e.propertyName !== "transform" || !animating) return;
    const w = width || 1;
    if (Math.abs(dragX) >= w - 0.5) {
      const dir = dragX < 0 ? 1 : -1;
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
      className="relative bg-cream aspect-[11/17] overflow-hidden"
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
        <MobileSlide look={prev} />
        <MobileSlide look={curr} />
        <MobileSlide look={next} />
      </div>

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

      <div className="absolute bottom-3 right-3 z-10 eyebrow text-cream bg-foreground/40 backdrop-blur px-3 py-1 rounded-full">
        Образ
      </div>
    </div>
  );
}

function MobileSlide({ look }: { look: Look }) {
  return (
    <div className="relative w-full h-full shrink-0">
      <img
        src={look.image}
        alt={`Образ ${look.sort}`}
        draggable={false}
        className="absolute inset-0 size-full object-contain pointer-events-none select-none"
      />
    </div>
  );
}

const TILE_GAP = 16;
const TILE_MIN = 160;
const TILE_MAX = 280;
const TILE_SCROLL_LG = 215;
const TILE_SCROLL_MD = 200;

function ProductsSlider({ products }: { products: Product[] }) {
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
      if (n <= 4 && idealW >= TILE_MIN) {
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

  if (!products.length) {
    return (
      <div className="w-full h-full min-h-[300px] flex items-center justify-center text-foreground/50 text-sm">
        Товары скоро появятся
      </div>
    );
  }

  const centerRow = fits && tileW === TILE_MAX;

  return (
    <div ref={wrapRef} className="relative w-full min-w-0">
      <div className="md:hidden grid grid-cols-2 gap-x-3 gap-y-6 w-full pt-2">
        {products.map((p) => (
          <ProductCell key={p.itemId} product={p} />
        ))}
      </div>

      <div className="hidden md:block w-full">
        {fits ? (
          <div
            className={cn("flex gap-4 w-full", centerRow ? "justify-center" : "justify-start")}
          >
            {products.map((p) => (
              <div
                key={p.itemId}
                style={{ width: tileW ?? undefined }}
                className="shrink-0"
              >
                <ProductCell product={p} />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div
              ref={scrollerRef}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {products.map((p) => (
                <div
                  key={p.itemId}
                  style={{ width: tileW ?? undefined }}
                  className="shrink-0 snap-start"
                >
                  <ProductCell product={p} />
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
    </div>
  );
}

function ProductCell({ product }: { product: Product }) {
  return (
    <Link
      to="/product/$slug"
      params={{ slug: product.slug }}
      className="group flex flex-col bg-cream transition-all w-full"
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
      <div className="px-2 md:px-3 pt-3 pb-1 md:pb-4 flex flex-col items-center gap-1.5 text-center">
        <div className="font-serif text-[15px] md:text-base leading-snug line-clamp-2 min-h-[2.6em] text-foreground">
          {product.title}
        </div>
        <div className="text-xs md:text-sm font-light text-foreground tabular-nums">
          {formatPrice(product.price.discounted)}
        </div>
      </div>
    </Link>
  );
}
