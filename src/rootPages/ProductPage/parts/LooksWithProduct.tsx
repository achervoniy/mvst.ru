'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import type { CatalogProduct, Look, LooksBlock, LooksResponse, TextBlock } from '@/shared/api/catalog';
import { clientApi } from '@/shared/api/clientFetch';
import { transformPrice } from '@/lib/currency';

import { LOOK_SLUGS, MVST_BRAND_TITLE } from '@/constants/runtimeConfig';

import st from './looksWithProduct.module.scss';

type Props = {
  productId: number;
};

function isLooksBlock(b: TextBlock | LooksBlock): b is LooksBlock {
  return b.type === 'looks';
}

function getProductId(p: CatalogProduct): number | undefined {
  return (p as unknown as { id?: number; itemId?: number }).id
    ?? (p as unknown as { itemId?: number }).itemId;
}

function getProductImage(p: CatalogProduct): string | undefined {
  const photo = p.photos?.[0];
  return photo?.middle ?? photo?.small ?? photo?.tiny;
}

function getProductPrice(p: CatalogProduct): number | undefined {
  const sku = p.skuList?.[0];
  return sku?.price_discount ?? sku?.price_original;
}

function getProductBrandTitle(p: CatalogProduct): string | undefined {
  const flat = (p as unknown as { brand_name?: string }).brand_name;
  const nested = (p as unknown as { brand?: { title?: string } }).brand?.title;
  return flat ?? nested;
}

function isMvstProduct(p: CatalogProduct): boolean {
  return getProductBrandTitle(p) === MVST_BRAND_TITLE;
}

function productsKey(products: CatalogProduct[]): string {
  return (products ?? []).map(getProductId).filter(Boolean).sort().join(',');
}

export function LooksWithProduct({ productId }: Props) {
  const [looks, setLooks] = useState<Look[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    let aborted = false;
    clientApi<LooksResponse>(`/v1/landing/${LOOK_SLUGS.all}`).then(res => {
      if (aborted || !res?.blocks) return;
      const allLooks = res.blocks
        .filter(isLooksBlock)
        .flatMap(b => b.looks);
      const filtered = allLooks
        .filter(l => (l.products ?? []).some(p => getProductId(p) === productId))
        .filter(l => (l.products ?? []).some(isMvstProduct));
      setLooks(filtered);
      setActiveIdx(0);
    });
    return () => {
      aborted = true;
    };
  }, [productId]);

  // Группируем образы по уникальному набору товаров — продукты под фото меняются
  // только если набор отличается от предыдущего активного.
  const activeLook = looks[activeIdx];
  const activeProducts = useMemo(
    () => (activeLook?.products ?? []).filter(isMvstProduct),
    [activeLook],
  );
  const productsSignature = useMemo(() => productsKey(activeProducts), [activeProducts]);

  if (looks.length === 0) return null;

  const activeLookImage = activeLook?.filePath;
  const hasMultipleLooks = looks.length > 1;

  const goPrev = () => setActiveIdx(i => (i - 1 + looks.length) % looks.length);
  const goNext = () => setActiveIdx(i => (i + 1) % looks.length);

  return (
    <section className={st.section}>
      <h2 className={st.title}>Образы с этой вещью</h2>

      <div className={st.layout}>
        <div className={st.lookFrame}>
          {activeLookImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={activeLookImage}
              src={activeLookImage}
              alt="Look"
              loading="lazy"
              className={st.lookHero}
            />
          )}
          {hasMultipleLooks && (
            <>
              <button
                type="button"
                className={`${st.lookNav} ${st.lookNavPrev}`}
                onClick={goPrev}
                aria-label="Предыдущий образ"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
                  <path d="M15 5 L8 12 L15 19" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                className={`${st.lookNav} ${st.lookNavNext}`}
                onClick={goNext}
                aria-label="Следующий образ"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
                  <path d="M9 5 L16 12 L9 19" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className={st.lookDots} role="tablist" aria-label="Образы">
                {looks.map((l, i) => (
                  <button
                    key={l.fileId}
                    type="button"
                    role="tab"
                    aria-selected={i === activeIdx}
                    aria-label={`Образ ${i + 1}`}
                    onClick={() => setActiveIdx(i)}
                    className={`${st.lookDot} ${i === activeIdx ? st.lookDotActive : ''}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className={st.sidePanel} key={productsSignature}>
          <div className={st.productsHead}>
            <span className={st.productsLabel}>
              Товары в образе · {activeProducts.length}
            </span>
          </div>

          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={16}
            slidesPerView={1.2}
            breakpoints={{
              600: { slidesPerView: 1.6, spaceBetween: 16 },
              1024: { slidesPerView: 1.4, spaceBetween: 20 },
              1440: { slidesPerView: 1.8, spaceBetween: 24 },
            }}
            className={st.products}
          >
            {activeProducts.map(p => {
              const pid = getProductId(p);
              const img = getProductImage(p);
              const price = getProductPrice(p);
              return (
                <SwiperSlide key={pid ?? p.slug} className={st.productSlide}>
                  <Link href={`/product/${p.slug}`} prefetch={false} className={st.productCard}>
                    <div className={st.productMedia}>
                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={img} alt={p.title} loading="lazy" className={st.productImg} />
                      ) : (
                        <div className={st.productImgPh} />
                      )}
                    </div>
                    <p className={st.productName}>{p.title}</p>
                    {price != null && (
                      <p className={st.productPrice}>{transformPrice(price)}</p>
                    )}
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>

          <Link href={`/collection/${LOOK_SLUGS.all}`} prefetch={false} className={st.allLink}>
            Все образы
          </Link>
        </div>
      </div>
    </section>
  );
}
