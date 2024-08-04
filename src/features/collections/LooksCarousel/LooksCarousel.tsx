import { ReactNode, useState } from 'react';
import { Swiper as SwiperInstance } from 'swiper';
import { FreeMode, Mousewheel, Pagination, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { CatalogProduct, LooksBlock } from '@/shared/api/catalog';

import { Responsive } from '@/ui/index';

import { LookSlideDesktop } from './LookSlide';
import { MobileProductsList } from './MobileProductsList';

import st from './styles.module.scss';

type Props = {
  block: LooksBlock;
  onSlideChanged?: (_index: number) => void;
  activeSlideIndex: number;
  productCarousel: (_items: CatalogProduct[]) => ReactNode;
};

export function LooksCarousel({ block, activeSlideIndex, onSlideChanged, productCarousel }: Props) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperInstance | null>(null);

  return (
    <>
      <Responsive.Desktop>
        <div className={st.LooksCarousel}>
          <Swiper
            spaceBetween={0}
            slidesPerView={1}
            thumbs={{ swiper: thumbsSwiper }}
            modules={[Thumbs]}
            onSlideChange={swiper => onSlideChanged?.(swiper.activeIndex + 1)}
          >
            {block.looks.map(look => (
              <SwiperSlide key={look.fileId} className={st.slide}>
                <LookSlideDesktop look={look} productCarousel={productCarousel} />
              </SwiperSlide>
            ))}
          </Swiper>

          <Swiper
            mousewheel
            freeMode
            onSwiper={setThumbsSwiper}
            spaceBetween={24}
            slidesPerView={8}
            modules={[Thumbs, Mousewheel, FreeMode]}
            className={st.thumbSlider}
          >
            {block.looks.map(look => (
              <SwiperSlide key={look.fileId} className={st.thumbSlide}>
                <img src={look.filePath} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Responsive.Desktop>

      <Responsive.TabletAndBelow>
        <div className={st.LooksCarousel}>
          <Swiper
            pagination={{ clickable: true, dynamicBullets: true, dynamicMainBullets: 5 }}
            spaceBetween={0}
            slidesPerView={1}
            modules={[Pagination]}
            onSlideChange={swiper => onSlideChanged?.(swiper.activeIndex + 1)}
          >
            {block.looks.map(look => (
              <SwiperSlide key={look.fileId} className={st.slideMobile}>
                <img src={look.filePath} loading="lazy" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <MobileProductsList activeSlideIndex={activeSlideIndex} looks={block.looks} />
      </Responsive.TabletAndBelow>
    </>
  );
}
