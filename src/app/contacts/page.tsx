import { ContactsPage as Page } from '@/rootPages/Contacts';
import { MainTemplate } from '@/shared/ui';

import { Footer } from '@/features/footer';
import { Header } from '@/features/header';

export default async function ContactsPage() {
  return (
    <MainTemplate header={<Header />} footer={<Footer />}>
      <Page />
    </MainTemplate>
  );
}
