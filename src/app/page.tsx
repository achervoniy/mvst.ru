import { EffectorNext } from '@effector/next';
import type { Metadata } from 'next';

import { HomePage as Page, pageHooks } from '@/rootPages/HomePage';
import { MainTemplate } from '@/shared/ui';

import { Footer } from '@/features/footer';
import { Header } from '@/features/header';

import { type PageProps, createRSC } from '@/lib/rsc';

const rsc = createRSC({ pageHooks });

export const metadata: Metadata = {
  title: {
    absolute: 'MVST — премиальная одежда, обувь и аксессуары',
  },
  description:
    'Элегантность вне времени. Женская и мужская коллекции MVST — безупречный крой, премиальные материалы и благородные оттенки. Новая коллекция SS26 уже в бутиках.',
  alternates: { canonical: 'https://mvst.ru/' },
  openGraph: {
    title: 'MVST — премиальная одежда, обувь и аксессуары',
    description:
      'Элегантность вне времени. Женская и мужская коллекции MVST — безупречный крой, премиальные материалы и благородные оттенки.',
    url: 'https://mvst.ru/',
  },
};

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
