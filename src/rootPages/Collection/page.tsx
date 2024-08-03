'use client';

import { useUnit } from 'effector-react';
import { useState } from 'react';

import { LooksCarousel } from '@/features/collections';
import { ProductsCarousel } from '@/features/home';

import { Typography } from '@/ui/index';

import { $collectionText, $collectionLooks, $collectionTitle } from './model';

import st from './styles.module.scss';

export function CollectionPage() {
  const looks = useUnit($collectionLooks);
  const text = useUnit($collectionText);
  const title = useUnit($collectionTitle);
  const [activeSlideIndex, setActiveSlideIndex] = useState(1);

  return (
    <section>
      <div className={st.head}>
        <Typography font="leading/h2" as="h1" align="center">
          {title}
        </Typography>

        <Typography font="paragraph/regular" className={st.counter}>
          1 / 100
        </Typography>
      </div>

      <LooksCarousel
        block={looks}
        // @ts-ignore
        productCarousel={products => <ProductsCarousel products={products} />}
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
