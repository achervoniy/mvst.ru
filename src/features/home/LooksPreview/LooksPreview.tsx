'use client';

import cn from 'classnames';
import { useUnit } from 'effector-react';
import { useMemo, useRef } from 'react';
import { Swiper as SwiperInstance } from 'swiper';
import { FreeMode, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import Link from 'next/link';

import { looksQuery } from '@/rootPages/HomePage/model';

import { SectionHead } from '@/features/home/SectionHead';

import { LOOK_SLUGS } from '@/constants/runtimeConfig';

import { Icon } from '@/ui/assets/Icon';

import st from './styles.module.scss';

type Props = {
  variant?: 'default' | 'compact';
  eyebrow?: string;
  title?: string;
  linkText?: string;
  limit?: number;
  offset?: number;
};

export function LooksPreview({
  variant = 'default',
  eyebrow = 'лукбук SS26',
  title = 'образы сезона',
  linkText = 'Смотреть все образы',
  limit = 10,
  offset = 0,
}: Props) {
  const data = useUnit(looksQuery.$data);

  const prevBtnRef = useRef<SVGSVGElement>(null);
  const nextBtnRef = useRef<SVGSVGElement>(null);

  const looks = useMemo(() => {
    if (!data?.blocks) return [];

    const all = data.blocks
      .filter((b): b is Extract<typeof b, { type: 'looks' }> => b.type === 'looks')
      .flatMap(b => b.looks);

    return all.slice(offset, offset + limit);
  }, [data, limit, offset]);

  if (looks.length === 0) return null;

  const onBeforeInit = (swiper: SwiperInstance) => {
    if (swiper.params.navigation && typeof swiper.params.navigation !== 'boolean') {
      // @ts-ignore
      swiper.params.navigation.prevEl = prevBtnRef.current;
      // @ts-ignore
      swiper.params.navigation.nextEl = nextBtnRef.current;
    }
  };

  return (
    <section className={cn(st.section, st[variant])}>
      <SectionHead
        eyebrow={eyebrow}
        title={title}
        linkHref={`/collection/${LOOK_SLUGS.all}`}
        linkText={linkText}
      />

      <div className={st.carousel}>
        <Icon name="CarouselArrow" className={st.arrow} ref={nextBtnRef} />
        <Icon name="CarouselArrow" className={cn(st.arrow, st.left)} ref={prevBtnRef} />

        <Swiper
          navigation
          onBeforeInit={onBeforeInit}
          modules={[Navigation, Pagination, FreeMode]}
          freeMode
          slidesPerView="auto"
          spaceBetween={12}
          breakpoints={{
            1024: { spaceBetween: 20 },
          }}
          pagination={{ clickable: true, dynamicBullets: true, dynamicMainBullets: 5 }}
        >
          {looks.map((look, idx) => (
            // @ts-ignore
            <SwiperSlide key={`${look.fileId}-${idx}`} className={st.slide}>
              <Link
                href={`/collection/${LOOK_SLUGS.all}`}
                className={st.card}
                prefetch={false}
              >
                <img loading="lazy" src={look.filePath} alt={`Look ${idx + 1}`} />
                <span className={st.badge}>Образ {String(idx + 1).padStart(2, '0')}</span>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
