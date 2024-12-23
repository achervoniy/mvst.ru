import { EffectorNext } from '@effector/next';
import { Metadata } from 'next';

import { CatalogPage as Page, pageHooks } from '@/rootPages/Catalog';
import { mapServerMetaToClient } from '@/shared/api/seo';

import { DEFAULT_MVST_SLUGS } from '@/constants/slugs';

import { type PageProps, createRSC, baseServices } from '@/lib/rsc';

const rsc = createRSC({ pageHooks });

export async function generateMetadata() {
  const seo = await baseServices.api.tsum
    .post('/seo/info', { url: `/brand/${DEFAULT_MVST_SLUGS.women}/must-774534.html` })
    .then(rs => mapServerMetaToClient(rs.data));

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      images: seo.ogImage,
      ogType: seo.ogType,
    },
    twitter: {
      title: seo.twitterTitle,
      description: seo.twitterDescription,
      card: seo.twitterCard,
      images: seo.twitterImage,
    },
  } as Metadata;
}

export default async function CatalogWomenPage(props: PageProps<{}>) {
  const result = await rsc(props);

  if (result.onRedirected) {
    result.onRedirected();
  }

  return (
    <EffectorNext values={result.values}>
      <Page />
    </EffectorNext>
  );
}
