'use client';

import { useEffect, useRef, useState } from 'react';

// import { HOME_PAGE_VIDEO_URL, HOME_PAGE_VIDEO_URL_MOBILE } from '@/constants/runtimeConfig';

import { AboutMust, CallToBuy, StreamBanner } from '@/features/home';

import { useHash, usePageVisibility } from '@/lib/hooks';

import homeBannerDesktop from './homeBannerDesktop.jpg';
import homeBannerMobile from './homeBannerMobile.jpg';
import beforeStreamHomeBannerDesktop from './streamBanners/fs-match-before-stream_desktop.jpg';
import beforeStreamHomeBannerMobile from './streamBanners/fs-match-before-stream_mobile.jpg';

import st from './styles.module.scss';

export function HomePage() {
  const hash = useHash();
  const pageRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const documentVisible = usePageVisibility();
  const [streamEnded, setStreamEnded] = useState(true);

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

  // Проверка стрима
  useEffect(() => {
    const now = new Date();
    const target = new Date(2026, 2, 28, 20, 0, 0);

    setStreamEnded(now > target);
  }, []);

  return (
    <div className={st.page} ref={pageRef}>
      <StreamBanner
        title="MVST SS26"
        images={
          streamEnded
            ? { desktop: homeBannerDesktop, mobile: homeBannerMobile }
            : { desktop: beforeStreamHomeBannerDesktop, mobile: beforeStreamHomeBannerMobile }
        }
        link={streamEnded ? '/collection/must-web' : '/fashion-show-march'}
      />

      {/* <div className={st.video}>
        <video autoPlay playsInline loop muted ref={videoRef}>
          <source src={HOME_PAGE_VIDEO_URL} type="video/mp4" media="(min-width:1023px)" />
          <source src={HOME_PAGE_VIDEO_URL_MOBILE} type="video/mp4" />
        </video>
      </div> */}
      {/* @/features/home */}
      {/* <Banner gender="all" /> */}
      <CallToBuy />
      <AboutMust />
    </div>
  );
}
