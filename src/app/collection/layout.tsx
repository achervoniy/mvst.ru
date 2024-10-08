import { MainTemplate } from '@/shared/ui';

import { Footer } from '@/features/footer';
import { Header } from '@/features/header';

type Props = Readonly<{
  children: React.ReactNode;
}>;

export default function CollectionLayout({ children }: Props) {
  return (
    <MainTemplate header={<Header />} footer={<Footer />}>
      {children}
    </MainTemplate>
  );
}
