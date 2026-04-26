import type { Metadata } from 'next';

import { ContactsPage as Page } from '@/rootPages/Contacts';
import { MainTemplate } from '@/shared/ui';

import { Footer } from '@/features/footer';
import { Header } from '@/features/header';

export const metadata: Metadata = {
  title: 'Бутики и контакты',
  description:
    'Адреса бутиков MVST в Москве, часы работы и телефоны. Примерьте новые коллекции в наших шоурумах ЦУМа.',
  alternates: { canonical: 'https://mvst.ru/contacts' },
  openGraph: {
    title: 'Бутики и контакты — MVST',
    description: 'Адреса бутиков MVST, часы работы и контактные телефоны.',
    url: 'https://mvst.ru/contacts',
  },
};

export default async function ContactsPage() {
  return (
    <MainTemplate header={<Header />} footer={<Footer />}>
      <Page />
    </MainTemplate>
  );
}
