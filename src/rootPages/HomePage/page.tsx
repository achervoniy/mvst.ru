'use client';

import { useVisibilityChange } from '@uidotdev/usehooks';
import cn from 'classnames';
import { useUnit } from 'effector-react';
import { useEffect, useRef } from 'react';

import { HOME_PAGE_VIDEO_URL, HOME_PAGE_VIDEO_URL_MOBILE } from '@/constants/runtimeConfig';

import { AboutMust, Banner, BoutiqueList, CallToBuy, ProductsCarousel } from '@/features/home';

import { useHash } from '@/lib/hooks';

import { catalogQuery } from './model';

import st from './styles.module.scss';

export function HomePage() {
  const catalog = useUnit(catalogQuery.$data);
  const hash = useHash();
  const pageRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const documentVisible = useVisibilityChange();

  const menList = catalog?.men?.list ?? [];
  const womenList = catalog?.women?.list ?? [];

  useEffect(() => {
    const target = pageRef.current?.querySelector?.(`[target-id='${hash}']`);

    if (target) {
      target.scrollIntoView({ behavior: 'auto', block: 'center' });
    }
  }, [hash]);

  useEffect(() => {
    if (!documentVisible) {
      videoRef.current?.pause();
    } else {
      videoRef.current?.play();
    }
  }, [documentVisible]);

  return (
    <div className={st.page} ref={pageRef}>
      <div className={st.video}>
        <video autoPlay playsInline loop muted ref={videoRef}>
          <source src={HOME_PAGE_VIDEO_URL} type="video/mp4" media="(min-width:1023px)" />
          <source src={HOME_PAGE_VIDEO_URL_MOBILE} type="video/mp4" />
        </video>
      </div>

      {womenList.length > 0 && (
        <div className={st.productsRow}>
          <Banner gender="f" />
          <ProductsCarousel products={womenList} />
        </div>
      )}

      {menList.length > 0 && (
        <div className={cn(st.productsRow, st.reverse)}>
          <Banner gender="m" />
          <ProductsCarousel products={menList} />
        </div>
      )}

      <BoutiqueList />
      <CallToBuy />
      <AboutMust />
    </div>
  );
}
