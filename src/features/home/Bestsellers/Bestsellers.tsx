'use client';

import { useUnit } from 'effector-react';
import { useMemo } from 'react';

import { catalogQuery } from '@/rootPages/HomePage/model';

import { ProductsCarousel } from '@/features/home/ProductsCarousel';
import { SectionHead } from '@/features/home/SectionHead';

import { HOME_PAGE_BESTSELLERS_SLUGS } from '@/constants/runtimeConfig';

import st from './styles.module.scss';

const BESTSELLERS_FALLBACK_COUNT = 8;

export function Bestsellers() {
  const data = useUnit(catalogQuery.$data);

  const products = useMemo(() => {
    if (!data) return [];

    const pool = [...(data.women?.list ?? []), ...(data.men?.list ?? [])];

    if (HOME_PAGE_BESTSELLERS_SLUGS.length > 0) {
      const bySlug = new Map(pool.map(p => [p.slug, p]));
      return HOME_PAGE_BESTSELLERS_SLUGS.map(slug => bySlug.get(slug)).filter(
        (p): p is (typeof pool)[number] => Boolean(p),
      );
    }

    // Фолбэк: чередуем женские и мужские, пока список не кончится
    const women = data.women?.list ?? [];
    const men = data.men?.list ?? [];
    const maxLen = Math.max(women.length, men.length);
    const mixed: typeof pool = [];
    for (let i = 0; i < maxLen && mixed.length < BESTSELLERS_FALLBACK_COUNT; i += 1) {
      if (women[i]) mixed.push(women[i]);
      if (men[i] && mixed.length < BESTSELLERS_FALLBACK_COUNT) mixed.push(men[i]);
    }
    return mixed;
  }, [data]);

  if (products.length === 0) return null;

  return (
    <section className={st.section}>
      <SectionHead eyebrow="выбор MVST" title="бестселлеры" />
      <ProductsCarousel products={products} gender="women" version="v1" />
    </section>
  );
}
