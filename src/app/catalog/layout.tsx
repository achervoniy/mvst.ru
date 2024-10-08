import { MainTemplate } from '@/shared/ui';

import { Footer } from '@/features/footer';
import { Header } from '@/features/header';

type Props = Readonly<{
  children: React.ReactNode;
}>;

export default function CatalogLayout({ children }: Props) {
  return (
    <MainTemplate header={<Header />} footer={<Footer />} contentResetStyles>
      {children}
    </MainTemplate>
  );
}
