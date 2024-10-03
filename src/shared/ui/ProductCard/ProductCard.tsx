import cn from 'classnames';
import { forwardRef, memo } from 'react';

import { CatalogProduct } from '@/shared/api/catalog';

import { transformPrice } from '@/lib/currency';

import { Typography } from '@/ui/index';

import { ProductCardImage } from './Image';

import st from './styles.module.scss';

type Props = {
  product: CatalogProduct;
};

export const ProductCard = memo(
  forwardRef<HTMLAnchorElement, Props>(({ product }, ref) => {
    const [imagePrimary, imageSecondary] = product.photos;
    const firstAvailableSku = product.skuList.find(sku => sku.availabilityInStock) ?? product.skuList[0];

    return (
      <a ref={ref} className={cn(st.ProductCard)} href={`https://www.tsum.ru/product/${product.slug}/`} target="_blank">
        <div className={st.content}>
          <div className={cn(st.photoContainer, st.opacity, { [st.hasSecondImage]: !!imageSecondary })}>
            <div className={st.photoContent}>
              <ProductCardImage photo={imagePrimary} className={st.photo} itemProp="image" />
              {!!imageSecondary && <ProductCardImage photo={imageSecondary} className={st.photo} itemProp="image" />}
            </div>
          </div>
        </div>

        <div className={st.info}>
          <div className={st.shortInfo}>
            <Typography
              font="body/regular"
              className={cn(st.title, st.productTitle, {
                [st.titleOnlyOneRow]: false,
              })}
            >
              {product.title}
            </Typography>
          </div>

          {firstAvailableSku && (
            <Typography
              font="body/regular"
              className={cn(st.title, st.productTitle, {
                [st.titleOnlyOneRow]: false,
              })}
            >
              {transformPrice(firstAvailableSku.internationalPrice.displayed.original)}
            </Typography>
          )}
        </div>
      </a>
    );
  }),
);
