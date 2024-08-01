import { EffectorNext } from '@effector/next';
import { notFound } from 'next/navigation';

import { FashionShow as Page, pageHooks } from '@/rootPages/FashionShow';

import { type PageProps, createRSC } from '@/lib/rsc';

const rsc = createRSC({ pageHooks });

export default async function FashionPage(props: PageProps) {
  const result = await rsc(props);

  if (result.is404) {
    notFound();
  }

  if (result.onRedirected) {
    result.onRedirected();
  }

  return (
    <EffectorNext values={result.values}>
      <Page />
    </EffectorNext>
  );
}
