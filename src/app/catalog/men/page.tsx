import { EffectorNext } from '@effector/next';

import { CatalogPage as Page, pageHooks } from '@/rootPages/Catalog';

import { type PageProps, createRSC } from '@/lib/rsc';

const rsc = createRSC({ pageHooks });

export default async function CatalogMenPage(props: PageProps<{}>) {
  const result = await rsc(props);

  if (result.onRedirected) {
    result.onRedirected();
  }

  return (
    <EffectorNext values={result.values}>
      <Page pageTitle="Мужская одежда" />
    </EffectorNext>
  );
}
