import { notFound } from 'next/navigation';

import { ProductPage } from '@/rootPages/ProductPage';

import { fetchProductById } from '@/shared/api/product';

import type { Metadata } from 'next';

type PageParams = { slug: string };

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const product = await fetchProductById(params.slug);

  if (!product) {
    return { title: 'Товар не найден — MVST' };
  }

  const title = `${product.title} — ${product.brand.title} — MVST`;
  const description = [product.category?.title, product.color?.title].filter(Boolean).join(' · ');

  return {
    title,
    description: description || title,
    openGraph: {
      title,
      description: description || undefined,
    },
  };
}

export default async function ProductRoutePage({ params }: { params: PageParams }) {
  const slug = params.slug?.trim();

  if (!slug) {
    notFound();
  }

  // Бэкенд принимает как числовой id, так и slug-формата "12345-goods-title"
  const product = await fetchProductById(slug);

  if (!product) {
    notFound();
  }

  return <ProductPage product={product} />;
}
