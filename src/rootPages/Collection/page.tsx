'use client';

import { useUnit } from 'effector-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { LOOK_SLUGS } from '@/constants/runtimeConfig';

import { LooksCarousel } from '@/features/collections';
import { changeCollectionCounter } from '@/features/header';
import { CallToBuy, ProductsCarousel } from '@/features/home';

import { Responsive, Typography } from '@/ui/index';

import { $collectionText, $collectionLooks, $collectionTitle, versionField } from './model';

import st from './styles.module.scss';

const getTitle = (slug: string) => {
  switch (slug) {
    case LOOK_SLUGS.men:
      return 'Мужская коллекция';

    case LOOK_SLUGS.women:
      return 'Женская коллекция';

    case LOOK_SLUGS.all:
      return 'Коллекция SS26';

    default:
      return undefined;
  }
};

export function CollectionPage() {
  const looks = useUnit($collectionLooks);
  const text = useUnit($collectionText);
  const title = useUnit($collectionTitle);
  const params = useParams();
  const [activeSlideIndex, setActiveSlideIndex] = useState(1);
  const collectionCounterChanged = useUnit(changeCollectionCounter);
  const version = useUnit(versionField.$value);

  const lookLen = looks?.looks?.length;
  const pageTitle = getTitle(params.slug as string) ?? title;

  useEffect(() => {
    collectionCounterChanged({ current: activeSlideIndex, length: lookLen });
  }, [activeSlideIndex, collectionCounterChanged, lookLen]);

  return (
    <section className={st[version]}>
      <div className={st.head}>
        <Typography font="leading/h2" as="h1" align="center">
          {pageTitle}
        </Typography>

        <Typography font="paragraph/regular" className={st.counter}>
          {activeSlideIndex} / {looks?.looks?.length}
        </Typography>
      </div>

      <LooksCarousel
        key={title}
        block={looks}
        version={version}
        productCarousel={products => (
          <ProductsCarousel
            products={products}
            className={st.productsSlider}
            version={version}
            gender={LOOK_SLUGS.women === params.slug ? 'women' : 'men'}
          />
        )}
        activeSlideIndex={activeSlideIndex}
        onSlideChanged={setActiveSlideIndex}
        gender={LOOK_SLUGS.women === params.slug ? 'women' : 'men'}
      />

      {text?.text && (
        <Responsive.Desktop>
          <Typography
            font="paragraph/regular"
            align="center"
            dangerouslySetInnerHTML={{ __html: text?.text }}
            className={st.lookDescription}
          />
        </Responsive.Desktop>
      )}

      <Responsive.TabletAndBelow>
        <CallToBuy />
      </Responsive.TabletAndBelow>
    </section>
  );
}
