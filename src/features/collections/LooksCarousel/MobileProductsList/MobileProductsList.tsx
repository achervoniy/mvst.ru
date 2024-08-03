import { Look } from '@/shared/api/catalog';

import { transformPrice } from '@/lib/currency';

import { Typography } from '@/ui/index';

import { Icon } from '@/ui/assets/Icon';

import st from './styles.module.scss';

type Props = {
  activeSlideIndex: number;
  looks: Look[];
};

export function MobileProductsList({ activeSlideIndex, looks }: Props) {
  const activeLook = looks[activeSlideIndex];

  if (!activeLook) {
    return null;
  }

  return (
    <div className={st.MobileProductsList}>
      {activeLook.products.map(product => (
        <a
          key={product.id}
          href={`https://www.tsum.ru/product/${product.slug}/`}
          target="_blank"
          className={st.product}
        >
          <img loading="lazy" src={product.photos[0]?.middle} alt={product.title} />
          <Icon name="ShortLogo" className={st.logo} />

          <Typography font="body/regular" align="center" className={st.title}>
            {product.title}
          </Typography>
          <Typography font="body/regular" align="center">
            {transformPrice(product.skuList[0]?.price_original)}
          </Typography>
        </a>
      ))}
    </div>
  );
}
