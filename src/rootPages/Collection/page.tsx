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

export function CollectionPage() {
  const looks = useUnit($collectionLooks);
  const text = useUnit($collectionText);
  const title = useUnit($collectionTitle);
  const params = useParams();
  const [activeSlideIndex, setActiveSlideIndex] = useState(1);
  const collectionCounterChanged = useUnit(changeCollectionCounter);
  const version = useUnit(versionField.$value);

  const lookLen = looks.looks.length;
  const pageTitle = LOOK_SLUGS.women === params.slug ? 'Женская коллекция' : 'Мужская коллекция';

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
        version={version}
      />

      <Responsive.Desktop>
        <Typography
          font="paragraph/regular"
          align="center"
          dangerouslySetInnerHTML={{ __html: text.text }}
          className={st.lookDescription}
        />
      </Responsive.Desktop>

      <Responsive.TabletAndBelow>
        <CallToBuy />
      </Responsive.TabletAndBelow>
    </section>
  );
}
