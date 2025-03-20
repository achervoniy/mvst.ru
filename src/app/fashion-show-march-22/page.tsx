import { EffectorNext } from '@effector/next';

import { FashionShowPage as Page } from '@/rootPages/FashionShow';
import { MainTemplate } from '@/shared/ui';

import { Footer } from '@/features/footer';
import { Header } from '@/features/header';

export default async function FashionShowPage() {
  return (
    <EffectorNext>
      <MainTemplate header={<Header />} footer={<Footer />}>
        <Page />
      </MainTemplate>
    </EffectorNext>
  );
}
