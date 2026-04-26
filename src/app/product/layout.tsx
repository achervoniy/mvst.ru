import type { ReactNode } from 'react';

import { MainTemplate } from '@/shared/ui';

import { Footer } from '@/features/footer';
import { Header } from '@/features/header';

type Props = Readonly<{
  children: ReactNode;
}>;

export default function ProductLayout({ children }: Props) {
  return (
    <MainTemplate header={<Header />} footer={<Footer />} contentResetStyles>
      {children}
    </MainTemplate>
  );
}
