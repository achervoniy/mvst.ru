import cn from 'classnames';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { Swiper as SwiperInstance } from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Typography } from '@/ui/index';

import { Icon } from '@/ui/assets/Icon';

import { boutiqueList } from './schema';

import st from './styles.module.scss';

const SLIDES_LEN = 6;

export function BoutiqueList() {
  const [activeIndex, setActiveIndex] = useState(1);
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
    <div className={st.BoutiqueList} target-id="boutique">
      <div className={st.head}>
        <Typography font="leading/h2" className={st.title} align="center">
          наши бутики
        </Typography>
        <Typography font="paragraph/regular" className={st.counter}>
          {activeIndex} / {SLIDES_LEN}
        </Typography>
      </div>

      <Icon name="CarouselArrow" className={st.arrow} ref={nextBtnRef} />
      <Icon name="CarouselArrow" className={cn(st.arrow, st.left)} ref={prevBtnRef} />
      <Swiper
        navigation
        pagination={{ clickable: true }}
        onBeforeInit={onBeforeInit}
        spaceBetween={6}
        slidesPerView={1.1}
        breakpoints={{
          1024: {
            slidesPerView: 3,
            spaceBetween: 24,
          },
        }}
        modules={[Navigation, Pagination]}
        onSlideChange={swiper => setActiveIndex(swiper.activeIndex + 1)}
      >
        {boutiqueList.map(boutique => (
          <SwiperSlide key={boutique.title} className={st.slide}>
            <Image src={boutique.image} alt={boutique.title} />
            <div className={st.footer}>
              <Typography font="paragraph/bold" className={st.boutiqueTitle}>
                {boutique.title}
              </Typography>
              <Typography font="paragraph/regular">{boutique.address}</Typography>
              <Typography font="paragraph/regular">{boutique.time}</Typography>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
