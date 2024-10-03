import cn from 'classnames';
import React from 'react';

import { CatalogProduct } from '@/shared/api/catalog';
import { ProductCard } from '@/shared/ui';

import st from './ProductList.module.scss';

type Props = {
  products: CatalogProduct[];
};

export function ProductList({ products }: Props) {
  return (
    <div
      className={cn(st.productList, {
        [st.nosidebar]: true,
      })}
    >
      {products.map(product => {
        return <ProductCard key={product.id} product={product} />;
      })}
    </div>
  );
}
