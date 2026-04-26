'use client';

import Link from 'next/link';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { transformPrice } from '@/lib/currency';

import type { RecentItem } from './useRecentlyViewed';

import st from './miniCarousel.module.scss';

type Props = {
  title: string;
  products: RecentItem[];
};

export function MiniProductsCarousel({ title, products }: Props) {
  if (!products || products.length === 0) return null;

  return (
    <section className={st.section}>
      <h2 className={st.title}>{title}</h2>

      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={16}
        slidesPerView={1.4}
        breakpoints={{
          600: { slidesPerView: 2.4, spaceBetween: 18 },
          900: { slidesPerView: 3.2, spaceBetween: 20 },
          1200: { slidesPerView: 4, spaceBetween: 24 },
        }}
        className={st.swiper}
      >
        {products.map(p => (
          <SwiperSlide key={p.id} className={st.slide}>
            <Link href={`/product/${p.slug}`} prefetch={false} className={st.card}>
              <div className={st.media}>
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt={p.title} loading="lazy" className={st.img} />
                ) : (
                  <div className={st.imgPh} />
                )}
              </div>
              <p className={st.name}>{p.title}</p>
              <p className={st.price}>{transformPrice(p.price)}</p>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
