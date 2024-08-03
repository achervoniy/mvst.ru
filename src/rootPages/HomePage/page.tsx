'use client';

import cn from 'classnames';
import { useUnit } from 'effector-react';

import { HOME_PAGE_VIDEO_URL } from '@/constants/runtimeConfig';

import { AboutMust, Banner, BoutiqueList, CallToBuy, ProductsCarousel } from '@/features/home';

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
