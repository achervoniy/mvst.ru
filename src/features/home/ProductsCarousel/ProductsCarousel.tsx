import cn from 'classnames';
import chunk from 'lodash-es/chunk';
import { useMemo, useRef } from 'react';
import { Swiper as SwiperInstance } from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { CatalogProduct } from '@/shared/api/catalog';

import { TSUM_SITE_LINK_BY_GENDER, buildProductLink } from '@/constants/runtimeConfig';

import { transformPrice } from '@/lib/currency';

import { Button, Typography } from '@/ui/index';

import { Icon } from '@/ui/assets/Icon';

import st from './styles.module.scss';

type Props = {
  products: CatalogProduct[];
  className?: string;
  version?: 'v1' | 'v2';
  gender: 'women' | 'men';
};

export function ProductsCarousel({ products, className, version, gender }: Props) {
  const slides = useMemo(() => chunk(products, 4), [products]);

  const prevBtnRef = useRef<SVGSVGElement>(null);
  const nextBtnRef = useRef<SVGSVGElement>(null);

  const onBeforeInit = (swiper: SwiperInstance) => {
    if (swiper.params.navigation && typeof swiper.params.navigation !== 'boolean') {
      // @ts-ignore
      swiper.params.navigation.prevEl = prevBtnRef.current;
      // @ts-ignore
      swiper.params.navigation.nextEl = nextBtnRef.current;
    }
  };

  return (
    <div className={cn(st.swiper, version && st[version], className)}>
      <Icon name="CarouselArrow" className={st.arrow} ref={nextBtnRef} />
      <Icon name="CarouselArrow" className={cn(st.arrow, st.left)} ref={prevBtnRef} />

      <Swiper
        navigation
        // slidesOffsetBefore={version === 'v1' && products.length > 3 ? 24 : 0}
        // slidesOffsetAfter={version === 'v1' && products.length > 3 ? 24 : 0}
        onBeforeInit={onBeforeInit}
        pagination={{ clickable: true, dynamicBullets: true, dynamicMainBullets: 5 }}
        spaceBetween={version === 'v1' ? 24 : 6}
        breakpoints={{
          1024: {
            spaceBetween: version === 'v1' ? 47 : 6,
          },
          1200: {
            spaceBetween: version === 'v1' ? 24 : 6,
          },
        }}
        slidesPerView={version === 'v1' ? 'auto' : 1}
        modules={[Navigation, Pagination]}
      >
        {version === 'v1'
          ? products.map((product, id) => (
              // @ts-ignore
              <SwiperSlide key={`outer-${id}-${product.slug}`} className={st.slide}>
                <a
                  // @ts-ignore
                  key={`inner-${product.itemId ?? product.slug}`}
                  className={st.product}
                  href={buildProductLink(product.slug)}
                  target="_blank"
                >
                  <img loading="lazy" src={product.photos[0]?.middle} alt={product.title} />

                  <Typography font="body/regular" align="center" className={st.title}>
                    {product.title}
                  </Typography>
                  <Typography font="body/regular" align="center">
                    {transformPrice(product.skuList[0]?.price_original)}
                  </Typography>
                </a>
              </SwiperSlide>
            ))
          : slides.map((items, id) => (
              // @ts-ignore
              <SwiperSlide key={`outer-${id}-${items[0].itemId ?? items[0].slug}`} className={st.slide}>
                {items.map(product => {
                  return (
                    <a
                      // @ts-ignore
                      key={`inner-${product.itemId ?? product.slug}`}
                      className={st.product}
                      href={buildProductLink(product.slug)}
                      target="_blank"
                    >
                      <img loading="lazy" src={product.photos[0]?.middle} alt={product.title} />

                      <Typography font="body/regular" align="center" className={st.title}>
                        {product.title}
                      </Typography>
                      <Typography font="body/regular" align="center">
                        {transformPrice(product.skuList[0]?.price_original)}
                      </Typography>
                    </a>
                  );
                })}
              </SwiperSlide>
            ))}
      </Swiper>

      <Button
        stretch
        className={st.action}
        onClick={() => {
          if (typeof window !== 'undefined') {
            window.open(TSUM_SITE_LINK_BY_GENDER[gender], '__blank');
          }
        }}
      >
        Смотреть все вещи
      </Button>
    </div>
  );
}
