import { ReactNode } from 'react';

import { CatalogProduct, Look } from '@/shared/api/catalog';

import st from './styles.module.scss';

type Props = {
  look: Look;
  productCarousel: (_items: CatalogProduct[]) => ReactNode;
};

export function LookSlideDesktop({ look, productCarousel }: Props) {
  return (
    <div className={st.slide}>
      <img src={look.filePath} alt="" loading="lazy" />
      {productCarousel(look.products)}
    </div>
  );
}

