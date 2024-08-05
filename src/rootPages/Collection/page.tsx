'use client';

import { useUnit } from 'effector-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { LOOK_SLUGS } from '@/constants/runtimeConfig';

import { LooksCarousel } from '@/features/collections';
import { changeCollectionCounter } from '@/features/header';
import { ProductsCarousel } from '@/features/home';

import { Typography } from '@/ui/index';

import { $collectionText, $collectionLooks, $collectionTitle } from './model';

import st from './styles.module.scss';

export function CollectionPage() {
  const looks = useUnit($collectionLooks);
  const text = useUnit($collectionText);
  const title = useUnit($collectionTitle);
  const params = useParams();
  const [activeSlideIndex, setActiveSlideIndex] = useState(1);
  const collectionCounterChanged = useUnit(changeCollectionCounter);

  const lookLen = looks.looks.length;
  const pageTitle = LOOK_SLUGS.women === params.slug ? 'Женская коллекция' : 'Мужская коллекция';

  useEffect(() => {
    collectionCounterChanged({ current: activeSlideIndex, length: lookLen });
  }, [activeSlideIndex, collectionCounterChanged, lookLen]);

  return (
    <section>
      <div className={st.head}>
        <Typography font="leading/h2" as="h1" align="center">
          {pageTitle}
        </Typography>

        <Typography font="paragraph/regular" className={st.counter}>
          {activeSlideIndex} / {looks.looks.length}
        </Typography>
      </div>

      <LooksCarousel
        key={title}
        block={looks}
        // @ts-ignore
        productCarousel={products => <ProductsCarousel products={products} className={st.productsSlider} />}
        activeSlideIndex={activeSlideIndex}
        onSlideChanged={setActiveSlideIndex}
      />

      <Typography
        font="paragraph/regular"
        align="center"
        dangerouslySetInnerHTML={{ __html: text.text }}
        className={st.lookDescription}
      />
    </section>
  );
}
