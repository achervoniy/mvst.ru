import cn from 'classnames';
import { useUnit } from 'effector-react';
import React from 'react';

import { CatalogProduct } from '@/shared/api/catalog';
import { productCardVariantField } from '@/shared/productCardVariant';
import { ProductCard } from '@/shared/ui';

import st from './ProductList.module.scss';

type Props = {
  products: CatalogProduct[];
  className?: string;
  noSidebar?: boolean;
};

export function ProductList({ products, className, noSidebar }: Props) {
  const productCardVariant = useUnit(productCardVariantField.$value);

  return (
    <div
      className={cn(st.productList, className, {
        [st.noSidebar]: noSidebar,
      })}
    >
      {products.map(product => {
        return (
          <ProductCard
            key={product.id}
            product={product}
            reversePhoto={productCardVariant === 'model'}
            photoVisibility={!!productCardVariant}
          />
        );
      })}
    </div>
  );
}
