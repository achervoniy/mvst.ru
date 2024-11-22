import { EffectorNext } from '@effector/next';

import { HomePage as Page, pageHooks } from '@/rootPages/HomePage';
import { MainTemplate } from '@/shared/ui';

import { Footer } from '@/features/footer';
import { Header } from '@/features/header';

import { type PageProps, createRSC } from '@/lib/rsc';

const rsc = createRSC({ pageHooks });

export default async function HomePage(props: PageProps) {
  const result = await rsc(props);

  return (
    <EffectorNext values={result.values}>
      <MainTemplate header={<Header />} footer={<Footer />}>
        <Page />
      </MainTemplate>
    </EffectorNext>
  );
}
