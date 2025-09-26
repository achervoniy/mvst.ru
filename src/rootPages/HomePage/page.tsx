'use client';

import cn from 'classnames';
import { useUnit } from 'effector-react';
import { useEffect, useRef } from 'react';

// import { HOME_PAGE_VIDEO_URL, HOME_PAGE_VIDEO_URL_MOBILE } from '@/constants/runtimeConfig';

import { AboutMust, Banner, CallToBuy, ProductsCarousel, StreamBanner } from '@/features/home';

import { useHash, usePageVisibility } from '@/lib/hooks';

import { catalogQuery } from './model';
import fw25Desktop from './streamBanners/fashion-show-september_desktop.jpg';
import fw25Mobile from './streamBanners/fashion-show-september_mobile.jpg';

import st from './styles.module.scss';

const HIDE_CATALOG = true;

export function HomePage() {
  const catalog = useUnit(catalogQuery.$data);
  const hash = useHash();
  const pageRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const documentVisible = usePageVisibility();

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
      {/* Убираем видео https://jira.int.tsum.com/browse/FRONTEND-6160 */}
      {/* <div className={st.video}>
        <video autoPlay playsInline loop muted ref={videoRef}>
          <source src={HOME_PAGE_VIDEO_URL} type="video/mp4" media="(min-width:1023px)" />
          <source src={HOME_PAGE_VIDEO_URL_MOBILE} type="video/mp4" />
        </video>
      </div> */}

      <StreamBanner
        title="MVST FW25/26"
        images={{ desktop: fw25Desktop, mobile: fw25Mobile }}
        link="/fashion-show-september"
      />
      <Banner gender="all" />

      {!HIDE_CATALOG && (
        <>
          {womenList.length > 0 && (
            <div className={st.productsRow}>
              <Banner gender="f" />
              <ProductsCarousel products={womenList} gender="women" />
            </div>
          )}

          {menList.length > 0 && (
            <div className={cn(st.productsRow, st.reverse)}>
              <Banner gender="m" />
              <ProductsCarousel products={menList} gender="men" />
            </div>
          )}
        </>
      )}
      <CallToBuy />
      <AboutMust />
    </div>
  );
}
