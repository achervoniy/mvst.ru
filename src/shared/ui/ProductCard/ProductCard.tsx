import cn from 'classnames';
import { forwardRef, memo } from 'react';

import { CatalogProduct } from '@/shared/api/catalog';

import { transformPrice } from '@/lib/currency';

import { Typography } from '@/ui/index';

import { ProductCardImage } from './Image';

import st from './styles.module.scss';

type Props = {
  product: CatalogProduct;
  // Заменить первую и вторую картинку местами
  reversePhoto?: boolean;
  photoVisibility?: boolean;
};

export const ProductCard = memo(
  forwardRef<HTMLAnchorElement, Props>(({ product, reversePhoto, photoVisibility = true }, ref) => {
    const [imagePrimary, imageSecondary] = product.photos;
    const firstAvailableSku = product.skuList.find(sku => sku.availabilityInStock) ?? product.skuList[0];

    const firstImage = imageSecondary ? (reversePhoto ? imageSecondary : imagePrimary) : imagePrimary;
    const secondImage = imageSecondary ? (reversePhoto ? imagePrimary : imageSecondary) : imageSecondary;

    return (
      <a
        ref={ref}
        className={cn(st.ProductCard, {
          [st.photoVisibility]: photoVisibility,
        })}
        href={`https://www.tsum.ru/product/${product.slug}/`}
        target="_blank"
      >
        <div className={st.content}>
          <div className={cn(st.photoContainer, st.opacity, { [st.hasSecondImage]: !!secondImage })}>
            <div className={st.photoContent}>
              <ProductCardImage photo={firstImage} className={st.photo} itemProp="image" />
              {!!secondImage && <ProductCardImage photo={secondImage} className={st.photo} itemProp="image" />}
            </div>
          </div>
        </div>

        <div className={st.info}>
          <div className={st.shortInfo}>
            <Typography
              font="paragraph/regular"
              className={cn(st.title, st.productTitle, {
                [st.titleOnlyOneRow]: false,
              })}
            >
              {product.title}
            </Typography>
          </div>

          {firstAvailableSku && (
            <Typography
              font="paragraph/regular"
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
