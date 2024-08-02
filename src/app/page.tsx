import { EffectorNext } from '@effector/next';

import { HomePage as Page, pageHooks } from '@/rootPages/HomePage';

import { type PageProps, createRSC } from '@/lib/rsc';

const rsc = createRSC({ pageHooks });

export default async function HomePage(props: PageProps) {
  const result = await rsc(props);

  return (
    <EffectorNext values={result.values}>
      <Page />
    </EffectorNext>
  );
}
