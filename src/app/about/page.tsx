import { AboutPage as Page } from '@/rootPages/About';
import { MainTemplate } from '@/shared/ui';

import { Footer } from '@/features/footer';
import { Header } from '@/features/header';

export default async function AboutRoutePage() {
  return (
    <MainTemplate header={<Header />} footer={<Footer />}>
      <Page />
    </MainTemplate>
  );
}
