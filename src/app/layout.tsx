import { EffectorNext } from '@effector/next';
import type { Metadata } from 'next';

import { MainTemplate } from '@/shared/ui';

import { Footer } from '@/features/footer';
import { Header } from '@/features/header';

import { ProgressBar } from '@/ui/index';
import '@/ui/themes/reset.scss';
import '@/ui/themes/fonts.scss';

export const metadata: Metadata = {
  title: 'Must',
  description: 'Must description',
};

type Props = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: Props) {
  return (
    <html lang="ru">
      <EffectorNext>
        <body>
          <MainTemplate header={<Header />} footer={<Footer />}>
            {children}
          </MainTemplate>
          <ProgressBar />
        </body>
      </EffectorNext>
    </html>
  );
}
