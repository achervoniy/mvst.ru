'use client';

import { useUnit } from 'effector-react';

import { fashionShowQuery } from '@/rootPages/HomePage/model';

import { ProductsCarousel } from '@/features/home/ProductsCarousel';
import { SectionHead } from '@/features/home/SectionHead';

import st from './styles.module.scss';

type Props = { gender: 'men' | 'women' };

export function FashionShow({ gender }: Props) {
  const data = useUnit(fashionShowQuery.$data);

  const products = data?.[gender]?.list ?? [];

  if (products.length === 0) return null;

  const title = gender === 'women' ? 'женские образы с показа' : 'мужские образы с показа';

  return (
    <section className={st.section}>
      <SectionHead
        eyebrow="fashion show"
        title={title}
        linkHref={`/catalog/${gender}?labels=fashion_show`}
        linkText="Все образы с показа"
      />
      <ProductsCarousel products={products} gender={gender} version="v1" />
    </section>
  );
}
