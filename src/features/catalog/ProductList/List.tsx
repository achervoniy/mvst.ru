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
  nosidebar?: boolean;
};

export function ProductList({ products, className, nosidebar }: Props) {
  const productCardVariant = useUnit(productCardVariantField.$value);

  return (
    <div
      className={cn(st.productList, className, {
        [st.nosidebar]: nosidebar,
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
