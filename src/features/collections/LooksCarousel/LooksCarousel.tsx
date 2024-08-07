import cn from 'classnames';
import { ReactNode, useRef, useState } from 'react';
import { Swiper as SwiperInstance } from 'swiper';
import { FreeMode, Mousewheel, Navigation, Thumbs, Virtual } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { CatalogProduct, LooksBlock } from '@/shared/api/catalog';

import { Responsive } from '@/ui/index';

import { Icon } from '@/ui/assets/Icon';

import { LookSlideDesktop } from './LookSlide';
import { MobileLook } from './MobileLook';

import st from './styles.module.scss';

type Props = {
  block: LooksBlock;
  onSlideChanged?: (_index: number) => void;
  activeSlideIndex: number;
  productCarousel: (_items: CatalogProduct[]) => ReactNode;
  version: 'v1' | 'v2';
};

export function LooksCarousel({ block, activeSlideIndex, onSlideChanged, productCarousel, version }: Props) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperInstance | null>(null);
  const prevBtnRef = useRef<SVGSVGElement>(null);
  const nextBtnRef = useRef<SVGSVGElement>(null);

  const onBeforeInit = (swiper: SwiperInstance) => {
    if (swiper.params.navigation && typeof swiper.params.navigation !== 'boolean') {
      // @ts-ignore
      swiper.params.navigation.prevEl = prevBtnRef.current;
      // @ts-ignore
      swiper.params.navigation.nextEl = nextBtnRef.current;

      if (version === 'v2') {
        // @ts-ignore
        swiper.params.navigation.prevEl = nextBtnRef.current;
        // @ts-ignore
        swiper.params.navigation.nextEl = prevBtnRef.current;
      }
    }
  };

  // useLayoutEffect(() => {
  //   if (thumbsSwiper) {
  //     thumbsSwiper.slideTo(activeSlideIndex);
  //   }
  // }, [activeSlideIndex, thumbsSwiper]);

  return (
    <>
      <Responsive.Desktop>
        <div className={cn(st[version], st.LooksCarousel)}>
          <Swiper
            virtual
            spaceBetween={0}
            slidesPerView={1}
            thumbs={{ swiper: thumbsSwiper, autoScrollOffset: 0 }}
            modules={[Thumbs, Virtual]}
            onSlideChange={swiper => onSlideChanged?.(swiper.activeIndex + 1)}
          >
            {block.looks.map(look => (
              <SwiperSlide key={look.fileId} className={st.slide}>
                <LookSlideDesktop look={look} productCarousel={productCarousel} version={version} />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className={st.thumbWrapper}>
            <Icon name="CarouselArrow" className={st.arrow} ref={nextBtnRef} />
            <Icon name="CarouselArrow" direction="left" className={cn(st.arrow, st.left)} ref={prevBtnRef} />

            <Swiper
              mousewheel
              freeMode
              onBeforeInit={onBeforeInit}
              navigation
              onSwiper={setThumbsSwiper}
              spaceBetween={version === 'v2' ? 16 : 24}
              slidesPerView={version === 'v2' ? 7 : 12}
              modules={[Thumbs, Navigation, Mousewheel, FreeMode]}
              className={st.thumbSlider}
              direction={version === 'v2' ? 'vertical' : 'horizontal'}
            >
              {block.looks.map(look => (
                <SwiperSlide key={look.fileId} className={st.thumbSlide}>
                  <img src={look.filePath} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </Responsive.Desktop>

      <Responsive.TabletAndBelow>
        <MobileLook
          className={st.LooksCarousel}
          activeSlideIndex={activeSlideIndex}
          onSlideChanged={onSlideChanged}
          block={block}
        />
      </Responsive.TabletAndBelow>
    </>
  );
}
