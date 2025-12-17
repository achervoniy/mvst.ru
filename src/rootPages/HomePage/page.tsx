'use client';

import { useEffect, useRef, useState } from 'react';

import { HOME_PAGE_VIDEO_URL, HOME_PAGE_VIDEO_URL_MOBILE } from '@/constants/runtimeConfig';

import { AboutMust, Banner, CallToBuy, StreamBanner } from '@/features/home';

import { useHash, usePageVisibility } from '@/lib/hooks';

import fw25DesktopAfter from './streamBanners/fs-december-after-stream_desktop.jpg';
import fw25MobileAfter from './streamBanners/fs-december-after-stream_mobile.jpg';
import fw25Desktop from './streamBanners/fs-december-before-stream_desktop.jpg';
import fw25Mobile from './streamBanners/fs-december-before-stream_mobile.jpg';

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

  useEffect(() => {
    const now = new Date();
    const target = new Date(2025, 11, 17, 21, 0, 0);

    setStreamEnded(now > target);
  }, []);

  return (
    <div className={st.page} ref={pageRef}>
      <StreamBanner
        title="MVST FW25/26"
        images={
          streamEnded
            ? { desktop: fw25DesktopAfter, mobile: fw25MobileAfter }
            : { desktop: fw25Desktop, mobile: fw25Mobile }
        }
        link={streamEnded ? '/collection/must-web' : '/fashion-show-december'}
      />

      <div className={st.video}>
        <video autoPlay playsInline loop muted ref={videoRef}>
          <source src={HOME_PAGE_VIDEO_URL} type="video/mp4" media="(min-width:1023px)" />
          <source src={HOME_PAGE_VIDEO_URL_MOBILE} type="video/mp4" />
        </video>
      </div>
      <Banner gender="all" />
      <CallToBuy />
      <AboutMust />
    </div>
  );
}
