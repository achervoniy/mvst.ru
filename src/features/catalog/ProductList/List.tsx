import cn from 'classnames';
import React from 'react';

import { CatalogProduct } from '@/shared/api/catalog';
import { ProductCard } from '@/shared/ui';

import st from './ProductList.module.scss';

type Props = {
  products: CatalogProduct[];
  className?: string;
  nosidebar?: boolean;
};

export function ProductList({ products, className, nosidebar }: Props) {
  return (
    <div
      className={cn(st.productList, className, {
        [st.nosidebar]: nosidebar,
      })}
    >
      {products.map(product => {
        return <ProductCard key={product.id} product={product} reversePhoto />;
      })}
    </div>
  );
}
