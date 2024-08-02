import { CatalogProduct } from '@/shared/api/catalog';

import { transformPrice } from '@/lib/currency';

import { Typography } from '@/ui/index';

import st from './styles.module.scss';

type Props = {
  products: CatalogProduct[];
};

export function ProductsCarousel({ products }: Props) {
  return (
    <div className={st.carousel}>
      {products.map(product => {
        return (
          <a
            key={product.id}
            className={st.product}
            href={`https://www.tsum.ru/product/${product.slug}/`}
            target="_blank"
          >
            <img loading="lazy" src={product.photos[0]?.middle} alt={product.title} />
            <Typography font="body/regular" align="center" className={st.title}>
              {product.title}
            </Typography>
            <Typography font="body/regular" align="center">
              {transformPrice(product.skuList[0]?.price_original)}
            </Typography>
          </a>
        );
      })}
    </div>
  );
}
