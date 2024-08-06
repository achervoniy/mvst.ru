import { Pagination, Virtual } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { LooksBlock } from '@/shared/api/catalog';

import { MobileProductsList } from '../MobileProductsList';

import st from './styles.module.scss';

type Props = {
  block: LooksBlock;
  onSlideChanged?: (_index: number) => void;
  activeSlideIndex: number;
  className?: string;
};

export function MobileLook({ block, activeSlideIndex, onSlideChanged, className }: Props) {
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
    </>
  );
}
