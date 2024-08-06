import cn from 'classnames';
import { ReactNode } from 'react';

import { CatalogProduct, Look } from '@/shared/api/catalog';

import st from './styles.module.scss';

type Props = {
  look: Look;
  productCarousel: (_items: CatalogProduct[]) => ReactNode;
  version: 'v1' | 'v2';
};

export function LookSlideDesktop({ look, productCarousel, version }: Props) {
  return (
    <div className={cn(st.slide, st[version])}>
      <img src={look.filePath} alt="" loading="lazy" className={st.image} />
      {productCarousel(look.products)}
    </div>
  );
}

