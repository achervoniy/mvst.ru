import { Look } from '@/shared/api/catalog';

import { buildProductLink } from '@/constants/runtimeConfig';

import { transformPrice } from '@/lib/currency';

import { Typography } from '@/ui/index';

import st from './styles.module.scss';

type Props = {
  activeSlideIndex: number;
  looks: Look[];
};

export function MobileProductsList({ activeSlideIndex, looks }: Props) {
  const activeLook = looks[activeSlideIndex - 1];

  if (!activeLook) {
    return null;
  }

  return (
    <div className={st.wrapper}>
      <Typography font="leading/h2" className={st.title}>
        В этом образе
      </Typography>

      <div className={st.MobileProductsList}>
        {activeLook.products.map(product => (
          <a key={product.id} href={buildProductLink(product.slug)} target="_blank" className={st.product}>
            <img loading="lazy" src={product.photos[0]?.middle} alt={product.title} />

            <Typography font="body/regular" align="center" className={st.productTitle}>
              {product.title}
            </Typography>
            <Typography font="body/regular" align="center">
              {transformPrice(product.skuList[0]?.price_original)}
            </Typography>
          </a>
        ))}
      </div>
    </div>
  );
}
