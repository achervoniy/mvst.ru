'use client';

import { useUnit } from 'effector-react';

import { HOME_PAGE_VIDEO_URL } from '@/constants/runtimeConfig';

import { Banner, CallToBuy, ProductsCarousel } from '@/features/home';

import { catalogQuery } from './model';

import st from './styles.module.scss';

export function HomePage() {
  const catalog = useUnit(catalogQuery.$data);

  const menList = catalog?.men?.list ?? [];
  const womenList = catalog?.women?.list ?? [];

  return (
    <div className={st.page}>
      <div className={st.video}>
        <video autoPlay playsInline loop muted>
          <source src={HOME_PAGE_VIDEO_URL} type="video/mp4" />
        </video>
      </div>

      {womenList.length > 0 && (
        <>
          <Banner gender="f" />
          <ProductsCarousel products={womenList} />
        </>
      )}

      {menList.length > 0 && (
        <>
          <Banner gender="m" />
          <ProductsCarousel products={menList} />
        </>
      )}

      <CallToBuy />
    </div>
  );
}
