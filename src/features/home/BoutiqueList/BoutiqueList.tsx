import Image from 'next/image';
import { useState } from 'react';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Typography } from '@/ui/index';

import { boutiqueList } from './schema';

import st from './styles.module.scss';

const SLIDES_LEN = 6;

export function BoutiqueList() {
  const [activeIndex, setActiveIndex] = useState(1);

  return (
    <div className={st.BoutiqueList}>
      <div className={st.head}>
        <Typography font="leading/h2" className={st.title} align="center">
          наши бутики
        </Typography>
        <Typography font="paragraph/regular" className={st.counter}>
          {activeIndex} / {SLIDES_LEN}
        </Typography>
      </div>

      <Swiper
        spaceBetween={6}
        slidesPerView={1.1}
        modules={[Navigation, Pagination]}
        pagination
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
