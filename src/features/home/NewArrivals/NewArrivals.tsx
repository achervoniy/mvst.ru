'use client';

import { useUnit } from 'effector-react';

import { newArrivalsQuery } from '@/rootPages/HomePage/model';

import { ProductsCarousel } from '@/features/home/ProductsCarousel';
import { SectionHead } from '@/features/home/SectionHead';

import st from './styles.module.scss';

type Props = { gender: 'men' | 'women' };

export function NewArrivals({ gender }: Props) {
  const data = useUnit(newArrivalsQuery.$data);

  const products = data?.[gender]?.list?.slice(0, 12) ?? [];

  if (products.length === 0) return null;

  const title = gender === 'women' ? 'женские новинки' : 'мужские новинки';

  return (
    <section className={st.section}>
      <SectionHead
        eyebrow="коллекция SS26"
        title={title}
        linkHref={`/catalog/${gender}?sort=date`}
        linkText="Смотреть все"
      />
      <ProductsCarousel products={products} gender={gender} version="v1" />
    </section>
  );
}
