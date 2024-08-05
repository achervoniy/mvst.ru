'use client';

import cn from 'classnames';
import { useUnit } from 'effector-react';
import { useEffect, useRef } from 'react';

import { HOME_PAGE_VIDEO_URL } from '@/constants/runtimeConfig';

import { AboutMust, Banner, BoutiqueList, CallToBuy, ProductsCarousel } from '@/features/home';

import { useHash } from '@/lib/hooks';

import { catalogQuery } from './model';

import st from './styles.module.scss';

export function HomePage() {
  const catalog = useUnit(catalogQuery.$data);
  const hash = useHash();
  const pageRef = useRef<HTMLDivElement | null>(null);

  const menList = catalog?.men?.list ?? [];
  const womenList = catalog?.women?.list ?? [];

  useEffect(() => {
    const target = pageRef.current?.querySelector?.(`[target-id='${hash}']`);

    if (target) {
      target.scrollIntoView({ behavior: 'auto', block: 'center' });
    }
  }, [hash]);

  return (
    <div className={st.page} ref={pageRef}>
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
