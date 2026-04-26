'use client';

import cn from 'classnames';
import { useUnit } from 'effector-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import type { V1CatalogProduct, V1ProductImage, V1ProductOffer } from '@/shared/api/product';
import { addToCart, cartOpened, useHydrateCart } from '@/shared/cart';

import { buildProductLink } from '@/constants/runtimeConfig';


import { transformPrice } from '@/lib/currency';

import { LooksWithProduct } from './parts/LooksWithProduct';
import { RecentlyViewed } from './parts/RecentlyViewed';
import { RelatedProducts } from './parts/RelatedProducts';
import { useTrackRecentlyViewed } from './parts/useRecentlyViewed';


import st from './styles.module.scss';

/* ─── helpers ─── */

function pickSrc(img: V1ProductImage, size: 'hero' | 'thumb'): string {
  if (size === 'hero') return img.w2000 || img.w400 || img.w200 || '';
  return img.w200 || img.w400 || img.w2000 || '';
}

function sizeLabel(offer: Pick<V1ProductOffer, 'size'>): string {
  const s = offer.size;
  if (!s) return '';
  return s.russianSize || s.vendorSize || '';
}

function sizeTitle(offer: Pick<V1ProductOffer, 'size'>): string {
  const s = offer.size;
  if (!s) return '';
  const ru =
    s.russianLabel && s.russianSize ? `${s.russianLabel} ${s.russianSize}` : s.russianSize || '';
  const vendor =
    s.vendorLabel && s.vendorSize ? `${s.vendorLabel} ${s.vendorSize}` : s.vendorSize || '';
  if (ru && vendor) return `${ru} / ${vendor}`;
  return ru || vendor;
}

/* ─── types ─── */

type Props = { product: V1CatalogProduct };

type ColorVariant = {
  id: number;
  slug: string;
  title: string;
  color?: { id: number; title: string };
  images?: V1ProductImage[];
};

/* ─── component ─── */

export function ProductPage({ product }: Props) {
  useHydrateCart();
  useTrackRecentlyViewed(product);
  const [addItem, openCart] = useUnit([addToCart, cartOpened]);
  const images = product.images ?? [];
  const [mobileIdx, setMobileIdx] = useState(0);
  const [selectedOfferId, setSelectedOfferId] = useState<number | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [sizesOpen, setSizesOpen] = useState(false);
  const [sizeTableOpen, setSizeTableOpen] = useState(false);

  useEffect(() => {
    setSelectedOfferId(null);
    setSizesOpen(false);
    setSizeTableOpen(false);
  }, [product.id]);

  const anyModalOpen = sizesOpen || sizeTableOpen;
  useEffect(() => {
    if (!anyModalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSizesOpen(false);
        setSizeTableOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [anyModalOpen]);

  const sizesBlock = product.information?.find(b => b.id === 'sizes');
  const accordionBlocks = (product.information ?? []).filter(
    b => b.id !== 'brand' && b.id !== 'sizes',
  );
  const sizeTable = product.sizeTable;
  const primarySizeCode = sizeTable?.description?.code;

  /* цветовые варианты */
  const colorVariants = useMemo((): ColorVariant[] => {
    const map = new Map<number, ColorVariant>();
    map.set(product.id, {
      id: product.id,
      slug: product.slug,
      title: product.title,
      color: product.color,
      images: product.images,
    });
    (product.products ?? []).forEach(p =>
      map.set(p.id, { id: p.id, slug: p.slug, title: p.title, color: p.color, images: p.images }),
    );
    return Array.from(map.values());
  }, [product]);

  /* офферы */
  const sortedOffers = useMemo(() => {
    return [...(product.offers ?? [])].sort((a, b) => {
      const ra = parseInt(String(a.size?.russianSize ?? ''), 10);
      const rb = parseInt(String(b.size?.russianSize ?? ''), 10);
      return !Number.isNaN(ra) && !Number.isNaN(rb) ? ra - rb : 0;
    });
  }, [product.offers]);

  const availableOffers = sortedOffers.filter(o => o.quantity > 0);
  const inStock = availableOffers.length > 0;

  /* цена */
  const priceOffer = availableOffers[0] ?? sortedOffers[0];
  const hasDiscount =
    !!priceOffer &&
    priceOffer.discount > 0 &&
    priceOffer.price.originalPrice > priceOffer.price.priceWithDiscount;

  const buyUrl = buildProductLink(product.slug);

  const handleAddToCart = () => {
    const offer = availableOffers.find(o => o.id === selectedOfferId);
    if (!offer) {
      setFlash('Выберите размер');
      setTimeout(() => setFlash(null), 2400);
      return;
    }
    const firstImage = product.images?.[0];
    const imageSrc = firstImage ? firstImage.w400 || firstImage.w200 || firstImage.w2000 || '' : '';
    addItem({
      productId: product.id,
      slug: product.slug,
      title: product.title,
      brand: product.brand.title,
      color: product.color?.title,
      image: imageSrc,
      offerId: offer.id,
      sizeLabel: sizeLabel(offer),
      price: offer.price.priceWithDiscount,
      priceOriginal: offer.price.originalPrice,
    });
    openCart();
  };

  return (
    <article className={st.page}>
      {/* breadcrumb */}
      <nav className={st.breadcrumb} aria-label="Навигация">
        <Link href="/" className={st.crumb}>Главная</Link>
        <span className={st.crumbSep}>/</span>
        {product.category.titleLink && (
          <>
            <span className={st.crumbMuted}>{product.category.titleLink}</span>
            <span className={st.crumbSep}>/</span>
          </>
        )}
        <span className={st.crumbMuted}>{product.title}</span>
      </nav>

      {/* main grid */}
      <div className={st.grid}>
        {/* ── left: gallery ── */}
        <div className={st.media}>
          {/* desktop — 2-column grid of full images */}
          <div className={st.galleryGrid}>
            {images.map((img, i) => {
              const src = pickSrc(img, 'hero');
              if (!src) return null;
              return (
                <div key={i} className={st.galleryCell}>
                  <Image
                    src={src}
                    alt={`${product.title} — фото ${i + 1}`}
                    fill
                    sizes="(min-width: 1024px) 32vw, 50vw"
                    className={st.galleryImg}
                    priority={i < 2}
                    loading={i < 2 ? 'eager' : 'lazy'}
                  />
                  {i === 1 && sizesBlock && (
                    <button
                      type="button"
                      className={st.infoIcon}
                      onClick={() => setSizesOpen(true)}
                      aria-label="Размер и посадка"
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.4" />
                        <circle cx="12" cy="7.5" r="1" fill="currentColor" />
                        <path d="M12 11 v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
                      </svg>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* mobile — swiper */}
          <div className={st.mobileGallery}>
            {images.length > 0 ? (
              <Swiper
                modules={[Pagination]}
                spaceBetween={0}
                slidesPerView={1}
                pagination={{ clickable: true }}
                className={st.swiper}
                onSlideChange={s => setMobileIdx(s.activeIndex)}
              >
                {images.map((img, i) => {
                  const src = pickSrc(img, 'hero');
                  if (!src) return null;
                  return (
                    <SwiperSlide key={i} className={st.slide}>
                      <Image
                        src={src}
                        alt={`${product.title} — фото ${i + 1}`}
                        width={800}
                        height={1000}
                        className={st.slideImage}
                        priority={i === 0}
                        loading={i === 0 ? 'eager' : 'lazy'}
                      />
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            ) : (
              <div className={st.mainPlaceholder} />
            )}
            {images.length > 1 && (
              <span className={st.mobileCounter}>{mobileIdx + 1} / {images.length}</span>
            )}
            {sizesBlock && (
              <button
                type="button"
                className={st.infoIcon}
                onClick={() => setSizesOpen(true)}
                aria-label="Размер и посадка"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.4" />
                  <circle cx="12" cy="7.5" r="1" fill="currentColor" />
                  <path d="M12 11 v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* ── right: sticky info ── */}
        <aside className={st.info}>
          <header className={st.header}>
            <div className={st.headerMain}>
              <h1 className={st.title}>{product.title}</h1>
              <p className={st.subtitle}>
                {product.category.titleLink ?? product.category.title}
              </p>
              {priceOffer && (
                <p className={st.price}>
                  {transformPrice(priceOffer.price.priceWithDiscount)}
                  {hasDiscount && (
                    <span className={st.priceOld}>
                      {transformPrice(priceOffer.price.originalPrice)}
                    </span>
                  )}
                </p>
              )}
            </div>
          </header>

          {/* цвет */}
          {product.color && (
            <div className={st.section}>
              <p className={st.colorLabel}>
                <span className={st.labelMuted}>Цвет&nbsp;:&nbsp;</span>
                <span className={st.labelValue}>{product.color.title}</span>
              </p>
              <div className={st.colorSwatches}>
                {colorVariants.map(v => {
                  const self = v.id === product.id;
                  const thumb = v.images?.[0] ? pickSrc(v.images[0], 'thumb') : '';
                  const label = v.color?.title ?? v.title;
                  const inner = (
                    <span className={st.swatchInner}>
                      {thumb ? (
                        <Image
                          src={thumb}
                          alt={label}
                          width={56}
                          height={72}
                          className={st.swatchImg}
                        />
                      ) : (
                        <span className={st.swatchFallback}>{label[0]}</span>
                      )}
                    </span>
                  );
                  return self ? (
                    <span
                      key={v.id}
                      className={cn(st.swatch, st.swatchActive)}
                      aria-current="true"
                      title={label}
                    >
                      {inner}
                    </span>
                  ) : (
                    <Link
                      key={v.id}
                      href={`/product/${v.slug}`}
                      className={st.swatch}
                      prefetch={false}
                      title={label}
                    >
                      {inner}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* размер — чип-сетка */}
          {sortedOffers.length > 0 && (
            <div className={st.section}>
              <div className={st.sizesHeader}>
                <p className={st.sizesTitle}>
                  Размеры
                  {primarySizeCode && (
                    <>
                      <span className={st.sizeDot} aria-hidden>•</span>
                      <span className={st.sizeCode}>{primarySizeCode}</span>
                    </>
                  )}
                </p>
                {!!sizeTable?.table?.length && (
                  <button
                    type="button"
                    className={st.sizeGuideLink}
                    onClick={() => setSizeTableOpen(true)}
                  >
                    Таблица размеров
                  </button>
                )}
              </div>
              <ul className={st.sizeGrid} role="list">
                {sortedOffers.map(offer => {
                  const label = sizeLabel(offer);
                  if (!label) return null;
                  const available = offer.quantity > 0;
                  const active = offer.id === selectedOfferId;
                  const fullLabel = sizeTitle(offer);
                  return (
                    <li key={offer.id}>
                      <button
                        type="button"
                        className={cn(st.sizeChip, {
                          [st.sizeChipOut]: !available,
                          [st.sizeChipActive]: active,
                        })}
                        disabled={!available}
                        title={`${fullLabel}${available ? '' : ' — нет в наличии'}`}
                        onClick={() => available && setSelectedOfferId(offer.id)}
                      >
                        {label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* CTA */}
          <div className={st.actions}>
            <button
              type="button"
              className={st.primaryBtn}
              disabled={!inStock}
              onClick={handleAddToCart}
            >
              {inStock ? 'Заказать примерку' : 'Нет в наличии'}
            </button>
            <a
              href={buyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={st.secondaryBtn}
            >
              Купить в ЦУМ
            </a>
            {flash && <p className={st.flash}>{flash}</p>}
          </div>

          {/* accordion */}
          {accordionBlocks.length > 0 && (
            <div className={st.details}>
              {accordionBlocks.map(block => {
                const body = (
                  <div className={st.accordionBody}>
                    {block.description && (
                      <div
                        className={st.blockHtml}
                        dangerouslySetInnerHTML={{ __html: block.description }}
                      />
                    )}
                    {block.properties && block.properties.length > 0 && (
                      <dl className={st.propList}>
                        {block.properties.map((prop, idx) => (
                          <div key={`${prop.label}-${idx}`} className={st.propRow}>
                            <dt className={st.propLabel}>{prop.label}</dt>
                            <dd className={st.propValue}>{prop.value}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                  </div>
                );

                if (block.id === 'product') {
                  return (
                    <section key={block.id} className={st.staticBlock}>
                      <h3 className={st.staticTitle}>{block.title}</h3>
                      {body}
                    </section>
                  );
                }

                return (
                  <details key={block.id} className={st.accordion}>
                    <summary className={st.accordionHead}>
                      <span className={st.accordionTitle}>{block.title}</span>
                      <span className={st.accordionIcon} aria-hidden>+</span>
                    </summary>
                    {body}
                  </details>
                );
              })}
            </div>
          )}
        </aside>
      </div>

      <LooksWithProduct productId={product.id} />
      <RelatedProducts categoryId={product.category.id} currentId={product.id} />
      <RecentlyViewed currentId={product.id} />

      {sizeTableOpen && sizeTable && sizeTable.table.length > 0 && (
        <div
          className={st.sizeTableBackdrop}
          onClick={() => setSizeTableOpen(false)}
          role="presentation"
        >
          <div
            className={st.sizeTableModal}
            role="dialog"
            aria-modal="true"
            aria-label={sizeTable.title}
            onClick={e => e.stopPropagation()}
          >
            <header className={st.sizeTableHead}>
              <h2 className={st.sizeTableTitle}>{sizeTable.title}</h2>
              <button
                type="button"
                className={st.sizeTableClose}
                onClick={() => setSizeTableOpen(false)}
                aria-label="Закрыть"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
                  <path d="M5 5 L19 19 M19 5 L5 19" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </button>
            </header>
            <div className={st.sizeTableBody}>
              <div className={st.sizeTableScroll}>
                <table className={st.sizeTableEl}>
                  <thead>
                    <tr>
                      {sizeTable.table.map(row => (
                        <th key={row.code} className={st.sizeTableTh}>
                          <span className={st.sizeTableThTitle}>{row.title}</span>
                          <span className={st.sizeTableThCode}>{row.code}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({
                      length: Math.max(...sizeTable.table.map(r => r.sizes.length)),
                    }).map((_, rowIdx) => (
                      <tr key={rowIdx}>
                        {sizeTable.table.map(col => (
                          <td key={col.code} className={st.sizeTableTd}>
                            {col.sizes[rowIdx] ?? ''}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {sizesOpen && sizesBlock && (
        <div
          className={st.sizeFlyoutBackdrop}
          onClick={() => setSizesOpen(false)}
          role="presentation"
        >
          <aside
            className={st.sizeFlyoutPanel}
            role="dialog"
            aria-modal="true"
            aria-label={sizesBlock.title}
            onClick={e => e.stopPropagation()}
          >
            <header className={st.sizeFlyoutHead}>
              <h2 className={st.sizeFlyoutTitle}>{sizesBlock.title}</h2>
              <button
                type="button"
                className={st.sizeFlyoutClose}
                onClick={() => setSizesOpen(false)}
                aria-label="Закрыть"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
                  <path d="M5 5 L19 19 M19 5 L5 19" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </button>
            </header>
            <div className={st.sizeFlyoutBody}>
              {sizesBlock.description && (
                <div
                  className={st.blockHtml}
                  dangerouslySetInnerHTML={{ __html: sizesBlock.description }}
                />
              )}
              {sizesBlock.properties && sizesBlock.properties.length > 0 && (
                <dl className={st.propList}>
                  {sizesBlock.properties.map((prop, idx) => (
                    <div key={`${prop.label}-${idx}`} className={st.propRow}>
                      <dt className={st.propLabel}>{prop.label}</dt>
                      <dd className={st.propValue}>{prop.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </aside>
        </div>
      )}
    </article>
  );
}
