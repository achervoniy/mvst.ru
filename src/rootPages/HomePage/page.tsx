'use client';

import { useEffect, useRef, useState } from 'react';

import {
  AboutMust,
  Bestsellers,
  CallToBuy,
  CollectionBanners,
  EditorialBanners,
  FashionShow,
  LooksPreview,
  NewArrivals,
  StreamBanner,
} from '@/features/home';

import { useHash, usePageVisibility } from '@/lib/hooks';

import { RevealOnScroll } from '@/shared/ui/RevealOnScroll/RevealOnScroll';

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

      <RevealOnScroll><CollectionBanners /></RevealOnScroll>

      <RevealOnScroll delay={100}><NewArrivals gender="women" /></RevealOnScroll>
      <RevealOnScroll delay={100}><NewArrivals gender="men" /></RevealOnScroll>

      <RevealOnScroll>
        <LooksPreview
          eyebrow="лукбук SS26"
          title="образы сезона"
          linkText="Смотреть все образы"
          limit={8}
        />
      </RevealOnScroll>

      <RevealOnScroll><EditorialBanners /></RevealOnScroll>

      <RevealOnScroll><Bestsellers /></RevealOnScroll>

      <RevealOnScroll><FashionShow gender="women" /></RevealOnScroll>
      <RevealOnScroll><FashionShow gender="men" /></RevealOnScroll>

      <RevealOnScroll>
        <LooksPreview
          variant="compact"
          eyebrow="MVST collection"
          title="история коллекции"
          linkText="Перейти в лукбук"
          limit={8}
          offset={8}
        />
      </RevealOnScroll>

      <RevealOnScroll><AboutMust /></RevealOnScroll>

      <RevealOnScroll><CallToBuy /></RevealOnScroll>
    </div>
  );
}
