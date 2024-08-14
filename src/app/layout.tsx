import { EffectorNext } from '@effector/next';
import type { Metadata } from 'next';

import { MainTemplate } from '@/shared/ui';

import { Footer } from '@/features/footer';
import { Header } from '@/features/header';

import { ViewportProvider } from '@/lib/useViewport';

import { ProgressBar, MediaContextProvider, mediaStyle } from '@/ui/index';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '@/ui/themes/reset.scss';
import '@/ui/themes/fonts.scss';

export const metadata: Metadata = {
  title: 'Must Одежда - Элегантные решения для вашего гардероба',
  description: `Откройте для себя Must Одежду: современные и стильные коллекции для мужчин и женщин. Обновите свой гардероб с нашим уникальным выбором одежды, которая подчеркнёт вашу индивидуальность.`,
};

type Props = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: Props) {
  return (
    <html lang="ru">
      <head>
        <style type="text/css">{mediaStyle}</style>
      </head>

      <EffectorNext>
        <MediaContextProvider disableDynamicMediaQueries>
          <ViewportProvider>
            <body>
              <MainTemplate header={<Header />} footer={<Footer />}>
                {children}
              </MainTemplate>
              <ProgressBar />
            </body>
          </ViewportProvider>
        </MediaContextProvider>
      </EffectorNext>
    </html>
  );
}
