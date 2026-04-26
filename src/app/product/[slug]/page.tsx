import { notFound } from 'next/navigation';

import { ProductPage } from '@/rootPages/ProductPage';

import { fetchProductById } from '@/shared/api/product';

import type { Metadata } from 'next';

type PageParams = { slug: string };

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const product = await fetchProductById(params.slug);

  if (!product) {
    return { title: 'Товар не найден', robots: { index: false, follow: false } };
  }

  const title = `${product.title} — ${product.brand.title}`;
  const description =
    [product.category?.title, product.color?.title].filter(Boolean).join(' · ') ||
    `${product.title} от ${product.brand.title}. Купить в официальном магазине MVST.`;

  const ogImage = product.images?.[0]?.w2000 || product.images?.[0]?.w400 || product.images?.[0]?.w200;
  const url = `https://mvst.ru/product/${params.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      title,
      description,
      url,
      images: ogImage ? [{ url: ogImage, alt: product.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
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
