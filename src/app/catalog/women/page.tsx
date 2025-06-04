import { EffectorNext } from '@effector/next';
import { notFound } from 'next/navigation';

import { CatalogPage as Page, pageHooks } from '@/rootPages/Catalog';

import { DEFAULT_MVST_SLUGS } from '@/constants/slugs';

import { getCatalogSEO } from '@/lib/meta';
import { type PageProps, createRSC } from '@/lib/rsc';

const rsc = createRSC({ pageHooks });

export async function generateMetadata({ searchParams }: GenerateMetaProps) {
  return getCatalogSEO(`/brand/${DEFAULT_MVST_SLUGS.women}/must-774534.html`, { searchParams });
}

export default async function CatalogWomenPage(props: PageProps<{}>) {
  const result = await rsc(props);

  if (result.onRedirected) {
    result.onRedirected();
  }

  if (result.is404) {
    notFound();
  }

  return (
    <EffectorNext values={result.values}>
      <Page gender="w" />
    </EffectorNext>
  );
}
