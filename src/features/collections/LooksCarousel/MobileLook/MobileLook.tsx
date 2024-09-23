import { Pagination, Virtual } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { LooksBlock } from '@/shared/api/catalog';

import { TSUM_SITE_LINK_BY_GENDER } from '@/constants/runtimeConfig';

import { Button } from '@/ui/index';

import { MobileProductsList } from '../MobileProductsList';

import st from './styles.module.scss';

type Props = {
  block: LooksBlock;
  onSlideChanged?: (_index: number) => void;
  activeSlideIndex: number;
  className?: string;
  gender: 'women' | 'men';
};

export function MobileLook({ block, activeSlideIndex, onSlideChanged, className, gender }: Props) {
  return (
    <>
      <div className={className}>
        <Swiper
          pagination={{ dynamicBullets: true, dynamicMainBullets: 5 }}
          spaceBetween={0}
          slidesPerView={1}
          modules={[Pagination, Virtual]}
          onSlideChange={swiper => onSlideChanged?.(swiper.activeIndex + 1)}
          virtual
        >
          {block.looks.map((look, id) => (
            <SwiperSlide key={`${look.fileId}-${id}`} className={st.slideMobile}>
              <img src={look.filePath} loading="lazy" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <MobileProductsList activeSlideIndex={activeSlideIndex} looks={block.looks} />

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
    </>
  );
}
