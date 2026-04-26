import type { Metadata } from 'next';

import { AboutPage as Page } from '@/rootPages/About';
import { MainTemplate } from '@/shared/ui';

import { Footer } from '@/features/footer';
import { Header } from '@/features/header';

export const metadata: Metadata = {
  title: 'О бренде',
  description:
    'История и философия MVST: безупречный крой, премиальные материалы и благородные оттенки. Узнайте о российском бренде премиальной одежды.',
  alternates: { canonical: 'https://mvst.ru/about' },
  openGraph: {
    title: 'О бренде — MVST',
    description:
      'История и философия MVST: безупречный крой, премиальные материалы и благородные оттенки.',
    url: 'https://mvst.ru/about',
  },
};

export default async function AboutRoutePage() {
  return (
    <MainTemplate header={<Header />} footer={<Footer />}>
      <Page />
    </MainTemplate>
  );
}
