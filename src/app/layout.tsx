import { EffectorNext } from '@effector/next';
import type { Metadata } from 'next';
import Head from 'next/head';

import { MainTemplate } from '@/shared/ui';

import { Footer } from '@/features/footer';
import { Header } from '@/features/header';

import { ProgressBar, MediaContextProvider, mediaStyle } from '@/ui/index';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
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
      <Head>
        <style type="text/css">{mediaStyle}</style>
      </Head>
      <EffectorNext>
        <MediaContextProvider disableDynamicMediaQueries>
          <body>
            <MainTemplate header={<Header />} footer={<Footer />}>
              {children}
            </MainTemplate>
            <ProgressBar />
          </body>
        </MediaContextProvider>
      </EffectorNext>
    </html>
  );
}
