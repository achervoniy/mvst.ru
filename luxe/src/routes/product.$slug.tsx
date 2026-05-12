import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductShelf } from "@/components/site/ProductShelf";
import { OutfitShelf } from "@/components/site/OutfitShelf";
import { getLookOutfitsByItemId } from "@/lib/look-recommendations";
import {
  pushRecentlyViewed,
  useRecentlyViewed,
} from "@/lib/recently-viewed";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Dialog, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";
import { getProductDetail } from "@/lib/tsum/catalog.functions";
import type { TsumImage, TsumOffer, TsumInformationSection, TsumProductVariant } from "@/lib/tsum/types";
import { formatRub } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useFittingCart } from "@/lib/fitting-cart";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ params }) => {
    const { detail, gender } = await getProductDetail({ data: { slug: params.slug } });
    if (!detail) throw notFound();
    const outfits = getLookOutfitsByItemId(detail.id, 6);
    return { detail, gender: gender ?? "women", outfits };
  },
  staleTime: 5 * 60 * 1000,
  head: ({ loaderData }) => {
    const d = loaderData?.detail;
    if (!d) return { meta: [{ title: "MVST" }] };
    const offers: TsumOffer[] = d.offers ?? [];
    const prices = offers.map((o) => o.price.priceWithDiscount).filter((n: number) => n > 0);
    const minPrice = prices.length ? Math.min(...prices) : 0;
    const title = `${d.title} — MVST`;
    const desc = `${d.title}${d.color?.title ? ` (${d.color.title})` : ""}. ${formatRub(minPrice)}.`;
    const img0 = d.images?.[0];
    const ogImage = img0?.w2000 ?? img0?.w400 ?? img0?.large ?? "";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        ...(ogImage ? [{ property: "og:image", content: ogImage }] : []),
      ],
    };
  },
  notFoundComponent: () => (
    <SiteLayout>
      <div className="px-6 py-32 text-center">
        <h1 className="font-serif text-4xl mb-4">Вещь не найдена</h1>
        <Link to="/" className="eyebrow border-b border-foreground pb-1">
          На главную
        </Link>
      </div>
    </SiteLayout>
  ),
  errorComponent: ({ error }) => (
    <SiteLayout>
      <div className="px-6 py-32 text-center">
        <h1 className="font-serif text-3xl mb-4">Не удалось загрузить товар</h1>
        <p className="text-foreground/60 text-sm">{error.message}</p>
      </div>
    </SiteLayout>
  ),
  component: ProductPage,
});

function pickImage(img: TsumImage): string {
  return img.w2000 ?? img.w1320 ?? img.w400 ?? img.large ?? img.middle ?? "";
}

// Кнопка-размер: сверху брендовый размер, снизу российский. Брендовая строка
// рисуется только когда у API есть label (IT/FR/INT/...) и vendorSize !== russianSize.
// Расшифровка лейблов выносится в заголовок селектора (см. sizeTitleSuffix).
function SizeLabels({ size }: { size: TsumOffer["size"] }) {
  const vendorLabel = size.vendorLabel?.trim();
  const vendorSize = size.vendorSize?.trim();
  const russianSize = size.russianSize?.trim();
  const showVendor =
    !!vendorLabel && !!vendorSize && vendorSize !== russianSize;
  const primary = russianSize || vendorSize || "—";
  return (
    <span className="flex flex-col items-center justify-center leading-none gap-0.5">
      {showVendor && (
        <span className="text-[10px] tracking-wider opacity-70">{vendorSize}</span>
      )}
      <span className="text-sm">{primary}</span>
    </span>
  );
}

// «(IT/RU)» к заголовку селектора, если все офферы используют одну и ту же
// брендовую систему и она отличается от российской. Иначе — пусто.
function sizeTitleSuffix(offers: TsumOffer[]): string {
  const labels = new Set<string>();
  for (const o of offers) {
    const vl = o.size.vendorLabel?.trim();
    const vs = o.size.vendorSize?.trim();
    const rs = o.size.russianSize?.trim();
    if (vl && vs && vs !== rs) labels.add(vl);
  }
  if (labels.size !== 1) return "";
  const [label] = labels;
  return ` (${label}/RU)`;
}

function ProductPage() {
  const { detail, gender, outfits } = Route.useLoaderData();
  const [selectedOfferId, setSelectedOfferId] = useState<number | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [sizePickerOpen, setSizePickerOpen] = useState(false);
  const offers: TsumOffer[] = detail.offers ?? [];
  // Берём только товарные фото (макс. 5). Иногда ЦУМ-API подмешивает
  // лукбук-кадры с другими вещами в самом конце массива — отсекаем.
  const images = ((detail.images ?? []) as TsumImage[]).slice(0, 5);
  const variants: TsumProductVariant[] = detail.products ?? [];
  const buyableOffers = offers.filter((o) => o.quantity > 0 && o.isBuyable !== false);
  const showSizes = offers.length > 0 && offers[0].size?.russianSize;
  const prices = offers.map((o) => o.price.priceWithDiscount).filter((n: number) => n > 0);
  const originals = offers.map((o) => o.price.originalPrice).filter((n: number) => n > 0);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const originalPrice = originals.length ? Math.min(...originals) : minPrice;
  const hasDiscount = originalPrice > minPrice && minPrice > 0;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - minPrice) / originalPrice) * 100)
    : 0;

  const tsumUrl = `https://www.tsum.ru/product/${detail.modelExtId}-${detail.slug.replace(/^\d+-/, "")}/`;

  // Корзина для примерки
  const cart = useFittingCart();
  // Если размер один — не требуем явного выбора
  const autoOffer = buyableOffers.length === 1 ? buyableOffers[0] : null;
  const effectiveOfferId = selectedOfferId ?? autoOffer?.id ?? null;
  const effectiveOffer = offers.find((o) => o.id === effectiveOfferId) ?? null;
  const inCart = effectiveOffer ? cart.hasItem(effectiveOffer.id) : false;

  const addOfferToFitting = (offer: TsumOffer) => {
    if (cart.hasItem(offer.id)) return;
    const thumb =
      images[0]?.w400 ?? images[0]?.w400x2 ?? images[0]?.w200x2 ?? images[0]?.w200 ?? "";
    cart.add({
      skuId: offer.id,
      productSlug: detail.slug,
      title: detail.title,
      color: detail.color.title,
      size: offer.size.russianSize,
      price: offer.price.priceWithDiscount,
      image: thumb,
    });
  };

  const handleAddToFitting = () => {
    if (effectiveOffer) {
      if (cart.hasItem(effectiveOffer.id)) {
        cart.setOpen(true);
        return;
      }
      addOfferToFitting(effectiveOffer);
      return;
    }
    if (showSizes && buyableOffers.length > 0) {
      setSizePickerOpen(true);
      return;
    }
    toast.error("Выберите размер");
  };

  // Информационные секции из API (без "О бренде" — у нас один бренд)
  const info: TsumInformationSection[] = detail.information ?? [];
  const findSection = (id: string): TsumInformationSection | undefined =>
    info.find((s) => s.id === id);
  const productSection = findSection("product");
  const sizesSection = findSection("sizes");

  // Клавиатурная навигация по лайтбоксу
  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setLightboxIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length));
      } else if (e.key === "ArrowRight") {
        setLightboxIndex((i) => (i === null ? i : (i + 1) % images.length));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, images.length]);

  // Счётчик для мобильной карусели
  useEffect(() => {
    if (!carouselApi) return;
    const onSelect = () => setCarouselIndex(carouselApi.selectedScrollSnap());
    onSelect();
    carouselApi.on("select", onSelect);
    carouselApi.on("reInit", onSelect);
    return () => {
      carouselApi.off("select", onSelect);
      carouselApi.off("reInit", onSelect);
    };
  }, [carouselApi]);

  // Запись в «недавно просмотренные» (только на клиенте)
  useEffect(() => {
    const img =
      images[0]?.w400 ?? images[0]?.w400x2 ?? images[0]?.w200x2 ?? images[0]?.w200 ?? "";
    pushRecentlyViewed({
      id: detail.id,
      slug: detail.slug,
      title: detail.title,
      image: img,
      price: minPrice,
      originalPrice,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail.id]);

  const recent = useRecentlyViewed(detail.id);

  return (
    <SiteLayout>
      <div className="px-6 md:px-12 pt-8 eyebrow text-foreground/60">
        <Link to="/" className="hover:text-accent">
          Главная
        </Link>
        <span className="mx-2">·</span>
        <Link to="/catalog/$gender" params={{ gender }} className="hover:text-accent">
          {gender === "women" ? "Для неё" : "Для него"}
        </Link>
        <span className="mx-2">·</span>
        <span className="text-foreground">{detail.title}</span>
      </div>

      <div className="grid md:grid-cols-[1.4fr_1fr] gap-10 md:gap-16 px-6 md:px-12 py-10 pb-28 md:pb-10">
        {/* Gallery — мобильная карусель */}
        <div className="md:hidden -mx-6">
          <Carousel
            opts={{ loop: true }}
            setApi={setCarouselApi}
            className="relative"
          >
            <CarouselContent className="ml-0">
              {images.map((img: TsumImage, i: number) => (
                <CarouselItem key={i} className="pl-0 basis-full">
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(i)}
                    className="relative block w-full h-[62vh] max-h-[560px] cursor-zoom-in bg-background"
                    aria-label={`Открыть фото ${i + 1}`}
                  >
                    <img
                      src={pickImage(img)}
                      alt={`${detail.title} — ${i + 1}`}
                      loading={i === 0 ? "eager" : "lazy"}
                      className="absolute inset-0 size-full object-contain mix-blend-multiply"
                    />
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          {images.length > 1 && (
            <div
              className="mt-2 text-center eyebrow text-foreground/55"
              aria-live="polite"
            >
              {carouselIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Gallery — десктоп: 2 колонки */}
        <div className="hidden md:grid grid-cols-2 gap-1 md:gap-2">
          {images.map((img: TsumImage, i: number) => (
            <button
              key={i}
              type="button"
              onClick={() => setLightboxIndex(i)}
              className="relative aspect-[3/4] cursor-zoom-in group"
              aria-label={`Открыть фото ${i + 1}`}
            >
              <img
                src={pickImage(img)}
                alt={`${detail.title} — ${i + 1}`}
                loading={i < 2 ? "eager" : "lazy"}
                className="absolute inset-0 size-full object-contain mix-blend-multiply transition-opacity group-hover:opacity-90"
              />
            </button>
          ))}
        </div>

        {/* Info */}
        <div className="md:sticky md:top-6 md:self-start space-y-8 pt-2">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl leading-tight">{detail.title}</h1>
            <div className="mt-4 flex items-baseline gap-3">
              <div className="text-lg">{formatRub(minPrice)}</div>
              {hasDiscount && (
                <>
                  <div className="text-foreground/45 line-through text-sm">
                    {formatRub(originalPrice)}
                  </div>
                  <div className="eyebrow text-accent">−{discountPercent}%</div>
                </>
              )}
            </div>
          </div>

          {variants.length > 0 && (
            <div>
              <div className="eyebrow text-foreground/60 mb-3">
                Цвет: <span className="text-foreground">{detail.color.title}</span>
              </div>
              {variants.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {variants.map((v) => {
                    const isCurrent =
                      v.slug === detail.slug || v.color.id === detail.color.id;
                    const thumb = v.images?.[0]?.w200x2 ?? v.images?.[0]?.w200 ?? "";
                    return (
                      <Link
                        key={v.id}
                        to="/product/$slug"
                        params={{ slug: v.slug }}
                        preload="intent"
                        aria-label={v.color.title}
                        className={cn(
                          "relative size-16 border bg-background",
                          isCurrent
                            ? "border-foreground"
                            : "border-transparent hover:border-foreground/40",
                        )}
                      >
                        {thumb && (
                          <img
                            src={thumb}
                            alt={v.color.title}
                            loading="lazy"
                            className="absolute inset-0 size-full object-contain mix-blend-multiply"
                          />
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {showSizes && (
            <div>
              <div className="eyebrow text-foreground/60 mb-3">
                Размер{sizeTitleSuffix(offers)}
              </div>
              <div className="flex flex-wrap gap-2">
                {offers.map((o: TsumOffer) => {
                  const disabled = o.quantity === 0 || o.isBuyable === false;
                  const active = selectedOfferId === o.id;
                  return (
                    <button
                      key={o.id}
                      onClick={() => !disabled && setSelectedOfferId(o.id)}
                      disabled={disabled}
                      className={cn(
                        "min-w-14 h-12 px-3 border transition-colors",
                        active
                          ? "border-foreground bg-foreground text-primary-foreground"
                          : "border-foreground/30 hover:border-foreground",
                        disabled &&
                          "opacity-30 line-through cursor-not-allowed hover:border-foreground/30",
                      )}
                    >
                      <SizeLabels size={o.size} />
                    </button>
                  );
                })}
              </div>
              {buyableOffers.length === 0 && (
                <div className="mt-2 text-xs text-foreground/60">Все размеры распроданы</div>
              )}
            </div>
          )}

          <div className="hidden md:flex flex-col gap-3">
            <button
              type="button"
              onClick={handleAddToFitting}
              disabled={buyableOffers.length === 0}
              className="w-full h-12 bg-foreground text-primary-foreground eyebrow-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:hover:bg-foreground"
            >
              {inCart ? "В корзине ✓" : "Примерить в бутике"}
            </button>
            <a
              href={tsumUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-12 border border-foreground text-foreground eyebrow-lg hover:bg-foreground hover:text-primary-foreground transition-colors text-center leading-[3rem]"
            >
              Купить в ЦУМе
            </a>
          </div>

          <Accordion type="single" collapsible className="border-t hairline">
            {productSection?.description && (
              <AccordionItem value="description">
                <AccordionTrigger className="eyebrow">Описание</AccordionTrigger>
                <AccordionContent className="text-foreground/75 whitespace-pre-line">
                  {productSection.description}
                </AccordionContent>
              </AccordionItem>
            )}

            {productSection?.properties?.length ? (
              <AccordionItem value="props">
                <AccordionTrigger className="eyebrow">Характеристики</AccordionTrigger>
                <AccordionContent>
                  <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2 text-sm">
                    {productSection.properties.map((p) => (
                      <div key={p.label} className="contents">
                        <dt className="text-foreground/55">{p.label}</dt>
                        <dd className="text-foreground/85">{p.value}</dd>
                      </div>
                    ))}
                  </dl>
                </AccordionContent>
              </AccordionItem>
            ) : null}

            {sizesSection && sizesSection.properties?.length ? (
              <AccordionItem value="sizes">
                <AccordionTrigger className="eyebrow">Размеры и посадка</AccordionTrigger>
                <AccordionContent>
                  <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2 text-sm">
                    {sizesSection.properties.map((p) => (
                      <div key={p.label} className="contents">
                        <dt className="text-foreground/55">{p.label}</dt>
                        <dd className="text-foreground/85">{p.value}</dd>
                      </div>
                    ))}
                  </dl>
                </AccordionContent>
              </AccordionItem>
            ) : null}

            <AccordionItem value="delivery">
              <AccordionTrigger className="eyebrow">Доставка</AccordionTrigger>
              <AccordionContent className="text-foreground/75">
                Курьерская доставка по Москве — 1–2 дня. По России — 2–5 рабочих дней. Доставка
                бесплатная.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="return">
              <AccordionTrigger className="eyebrow">Возврат</AccordionTrigger>
              <AccordionContent className="text-foreground/75">
                14 дней на возврат с момента получения. Изделие должно быть в исходном состоянии
                с фирменными ярлыками.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Рекомендательные полки */}
      {(outfits.length > 0 || recent.length > 0) && (
        <div className="border-t hairline">
          {outfits.length > 0 && (
            <OutfitShelf
              title="С чем носить"
              outfits={outfits}
              currentItemId={detail.id}
            />
          )}
          {recent.length > 0 && (
            <ProductShelf title="Вы недавно смотрели" items={recent} />
          )}
        </div>
      )}

      {/* Sticky CTA на мобильных */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur border-t hairline px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] grid grid-cols-2 gap-2">
        <a
          href={tsumUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full h-12 border border-foreground text-foreground text-[10px] tracking-[0.14em] uppercase font-medium text-center leading-[3rem]"
        >
          Купить в ЦУМе
        </a>
        <button
          type="button"
          onClick={handleAddToFitting}
          disabled={buyableOffers.length === 0}
          className="w-full h-12 bg-foreground text-primary-foreground text-[10px] tracking-[0.14em] uppercase font-medium hover:bg-accent transition-colors disabled:opacity-50"
        >
          {inCart ? "В корзине ✓" : "Примерить в бутике"}
        </button>
      </div>

      {/* Лайтбокс */}
      <Dialog open={lightboxIndex !== null} onOpenChange={(o) => !o && setLightboxIndex(null)}>
        <DialogPortal>
          <DialogOverlay className="bg-background" />
          <DialogPrimitive.Content
            className="fixed inset-0 z-50 flex items-center justify-center bg-background outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
            aria-describedby={undefined}
          >
            <DialogPrimitive.Title className="sr-only">{detail.title}</DialogPrimitive.Title>

            {lightboxIndex !== null && images[lightboxIndex] && (
              <img
                src={pickImage(images[lightboxIndex])}
                alt={`${detail.title} — ${lightboxIndex + 1}`}
                className="max-h-[92vh] max-w-[92vw] object-contain mix-blend-multiply"
              />
            )}

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((i) =>
                      i === null ? i : (i - 1 + images.length) % images.length,
                    );
                  }}
                  className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 size-12 flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors"
                  aria-label="Предыдущее фото"
                >
                  <ChevronLeft className="size-8" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((i) => (i === null ? i : (i + 1) % images.length));
                  }}
                  className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 size-12 flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors"
                  aria-label="Следующее фото"
                >
                  <ChevronRight className="size-8" />
                </button>
              </>
            )}

            <DialogPrimitive.Close
              className="absolute right-4 top-4 size-12 flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors"
              aria-label="Закрыть"
            >
              <X className="size-7" />
            </DialogPrimitive.Close>

            {lightboxIndex !== null && images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 eyebrow text-foreground/60">
                {lightboxIndex + 1} / {images.length}
              </div>
            )}
          </DialogPrimitive.Content>
        </DialogPortal>
      </Dialog>

      <SizePickerDialog
        open={sizePickerOpen}
        onOpenChange={setSizePickerOpen}
        offers={offers}
        buyableOffers={buyableOffers}
        tsumUrl={tsumUrl}
        hasItem={cart.hasItem}
        onConfirm={(offer) => {
          setSelectedOfferId(offer.id);
          addOfferToFitting(offer);
        }}
        onOpenCart={() => cart.setOpen(true)}
      />
    </SiteLayout>
  );
}

function SizePickerDialog({
  open,
  onOpenChange,
  offers,
  buyableOffers,
  tsumUrl,
  hasItem,
  onConfirm,
  onOpenCart,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  offers: TsumOffer[];
  buyableOffers: TsumOffer[];
  tsumUrl: string;
  hasItem: (id: number) => boolean;
  onConfirm: (offer: TsumOffer) => void;
  onOpenCart: () => void;
}) {
  const [localId, setLocalId] = useState<number | null>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  // Сбрасываем локальный выбор после закрытия
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => setLocalId(null), 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Когда модалка открыта и кнопки размеров переполняют контейнер,
  // подгоняем margin-right у скролл-контейнера так, чтобы крайняя видимая
  // кнопка обрезалась примерно наполовину. Левая кромка ряда (первая кнопка)
  // при этом остаётся на одной линии с тайтлом и CTA.
  useLayoutEffect(() => {
    if (!open) return;

    const adjust = () => {
      const container = mobileScrollRef.current;
      if (!container) return;

      // Сброс перед замером
      container.style.marginRight = "";

      const cw = container.clientWidth;
      if (container.scrollWidth <= cw) return;

      const inner = container.firstElementChild as HTMLElement | null;
      if (!inner) return;
      const buttons = Array.from(
        inner.querySelectorAll<HTMLButtonElement>(":scope > button"),
      );
      if (buttons.length === 0) return;

      const cLeft = container.getBoundingClientRect().left;

      // Первая кнопка, чей правый край выходит за контейнер
      let cutIdx = -1;
      for (let i = 0; i < buttons.length; i++) {
        const r = buttons[i].getBoundingClientRect();
        if (r.right - cLeft > cw) {
          cutIdx = i;
          break;
        }
      }
      if (cutIdx === -1) return;

      const cr = buttons[cutIdx].getBoundingClientRect();
      const relLeft = cr.left - cLeft;
      const w = cr.width;
      const visible = (cw - relLeft) / w;

      // В норме — ничего не делаем
      if (visible >= 0.25 && visible <= 0.75) return;

      // Если кнопка слишком хорошо видна — режем её саму до ~55%.
      // Если слишком плохо — двигаем срез к предыдущей.
      let targetIdx: number;
      if (visible > 0.75) {
        targetIdx = cutIdx;
      } else {
        if (cutIdx === 0) return;
        targetIdx = cutIdx - 1;
      }

      const tr = buttons[targetIdx].getBoundingClientRect();
      const tRelLeft = tr.left - cLeft;
      const tW = tr.width;
      const newCut = tRelLeft + tW * 0.55;
      if (newCut <= 0 || newCut >= cw) return;

      const margin = Math.max(0, Math.min(96, cw - newCut));
      container.style.marginRight = `${margin}px`;
    };

    const raf = requestAnimationFrame(adjust);

    // Наблюдаем за родителем, а не за самим контейнером — иначе наша же
    // правка margin-right триггерила бы ResizeObserver и вызвала бы цикл.
    let ro: ResizeObserver | null = null;
    const parent = mobileScrollRef.current?.parentElement;
    if (parent && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => adjust());
      ro.observe(parent);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
    };
  }, [open, offers.length]);

  const selected = offers.find((o) => o.id === localId) ?? null;
  const inCart = selected ? hasItem(selected.id) : false;

  const renderSize = (o: TsumOffer) => {
    const disabled = o.quantity === 0 || o.isBuyable === false;
    const active = localId === o.id;
    return (
      <button
        key={o.id}
        type="button"
        onClick={() => !disabled && setLocalId(o.id)}
        disabled={disabled}
        className={cn(
          "shrink-0 min-w-14 h-12 px-3 border transition-colors",
          active
            ? "border-foreground bg-foreground text-primary-foreground"
            : "border-foreground/30 hover:border-foreground",
          disabled &&
            "opacity-30 line-through cursor-not-allowed hover:border-foreground/30",
        )}
      >
        <SizeLabels size={o.size} />
      </button>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/40" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className={cn(
            "fixed z-50 bg-background outline-none flex flex-col shadow-lg",
            // Mobile: bottom-anchored, full width
            "inset-x-0 bottom-0 max-h-[85vh] border-t hairline",
            // Desktop: centered modal
            "md:inset-auto md:bottom-auto md:left-[50%] md:top-[50%] md:translate-x-[-50%] md:translate-y-[-50%] md:w-full md:max-w-md md:max-h-[80vh] md:border md:rounded-lg",
            // Animation
            "data-[state=open]:animate-in data-[state=closed]:animate-out duration-300",
            "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
            // Mobile: slide from bottom
            "data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
            // Desktop: cancel slide, use zoom
            "md:data-[state=open]:slide-in-from-bottom-0 md:data-[state=closed]:slide-out-to-bottom-0",
            "md:data-[state=open]:zoom-in-95 md:data-[state=closed]:zoom-out-95",
          )}
        >
          <DialogPrimitive.Title className="sr-only">Выберите размер</DialogPrimitive.Title>

          <div className="px-6 pt-5 pb-4 border-b hairline flex items-center justify-between">
            <div className="eyebrow text-foreground">
              Выберите размер{sizeTitleSuffix(offers)}
            </div>
            <DialogPrimitive.Close
              className="-mr-2 p-2 text-foreground/55 hover:text-foreground focus:outline-none focus-visible:outline-none"
              aria-label="Закрыть"
            >
              <X className="size-4" />
            </DialogPrimitive.Close>
          </div>

          <div className="flex-1 overflow-y-auto py-5">
            {/* Mobile: горизонтальный скролл с fade-маской справа */}
            <div
              ref={mobileScrollRef}
              className="md:hidden overflow-x-auto scrollbar-none [mask-image:linear-gradient(to_right,black_calc(100%-32px),transparent)] [-webkit-mask-image:linear-gradient(to_right,black_calc(100%-32px),transparent)]"
            >
              <div className="flex gap-2 w-max pl-6 pr-6">
                {offers.map(renderSize)}
              </div>
            </div>
            {/* Desktop: перенос строк */}
            <div className="hidden md:flex md:flex-wrap gap-2 px-6">
              {offers.map(renderSize)}
            </div>
            {buyableOffers.length === 0 && (
              <div className="mt-3 px-6 text-xs text-foreground/60">Все размеры распроданы</div>
            )}
          </div>

          <div className="border-t hairline px-6 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] grid grid-cols-2 gap-2 bg-background md:pb-5">
            <a
              href={tsumUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onOpenChange(false)}
              className="block w-full h-12 border border-foreground text-foreground text-[10px] tracking-[0.14em] uppercase font-medium text-center leading-[3rem] md:eyebrow-lg md:hover:bg-foreground md:hover:text-primary-foreground md:transition-colors"
            >
              Купить в ЦУМе
            </a>
            <button
              type="button"
              onClick={() => {
                if (!selected) return;
                if (inCart) {
                  onOpenChange(false);
                  onOpenCart();
                  return;
                }
                onConfirm(selected);
                onOpenChange(false);
              }}
              disabled={!selected || buyableOffers.length === 0}
              className="w-full h-12 bg-foreground text-primary-foreground text-[10px] tracking-[0.14em] uppercase font-medium hover:bg-accent transition-colors disabled:opacity-50 disabled:hover:bg-foreground md:eyebrow-lg"
            >
              {inCart ? "В корзине ✓" : "Примерить в бутике"}
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
