import { Metadata } from 'next';
import { headers } from 'next/headers';

import { mapServerMetaToClient } from '@/shared/api/seo';

import { baseServices } from './rsc';

export const canonical = (pathname?: string | null) => {
  if (pathname) {
    return `https://mvst.ru${pathname}`;
  }

  return `https://mvst.ru`;
};

export async function getCatalogSEO(
  url: string,
  { searchParams }: { searchParams: GenerateMetaProps['searchParams'] },
) {
  const headersList = headers();
  const seo = await baseServices.api.tsum.post('/seo/info', { url }).then(rs => mapServerMetaToClient(rs.data));
  const page = typeof searchParams.page === 'string' ? searchParams.page : null;

  const pageTitle = page ? `${seo.title} - страница ${page}` : `${seo.title} - бренд MVST`;
  const pageDescription = page
    ? `${seo.description} - страница ${page}`
    : `${seo.description} | MVST — официальный магазин модной одежды и аксессуаров для мужчин и женщин.`;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: seo.keywords,
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      images: seo.ogImage,
      type: seo.ogType,
      url: canonical(headersList.get('x-current-path')),
    },
    twitter: {
      title: seo.twitterTitle,
      description: seo.twitterDescription,
      card: seo.twitterCard,
      images: seo.twitterImage,
    },
  } as Metadata;
}
