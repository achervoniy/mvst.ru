import { EffectorNext } from '@effector/next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import { CatalogSelection as Page, pageHooks } from '@/rootPages/CatalogSelection';

import { getCatalogSEO } from '@/lib/meta';
import { type PageProps, createRSC } from '@/lib/rsc';

const rsc = createRSC({ pageHooks });

export async function generateMetadata({ searchParams }: GenerateMetaProps<{ selection?: string }>) {
  const headersList = headers();
  const pathname = headersList.get('x-current-path')!;

  return getCatalogSEO(pathname, { searchParams });
}

export default async function CatalogSelPage(props: PageProps<{}>) {
  const result = await rsc(props);

  if (result.onRedirected) {
    result.onRedirected();
  }

  if (result.is404) {
    notFound();
  }

  return (
    <EffectorNext values={result.values}>
      <Page />
    </EffectorNext>
  );
}
