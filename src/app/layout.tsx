import { EffectorNext } from '@effector/next';
import type { Metadata } from 'next';
import Script from 'next/script';

import { ViewportProvider } from '@/lib/useViewport';

import { ProgressBar, MediaContextProvider, mediaStyle } from '@/ui/index';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '@/ui/themes/reset.scss';
import '@/ui/themes/fonts.scss';

export const metadata: Metadata = {
  title: 'MVST Одежда - Элегантные решения для вашего гардероба',
  description: `Откройте для себя MVST Одежду: современные и стильные коллекции для мужчин и женщин. Обновите свой гардероб с нашим уникальным выбором одежды, которая подчеркнёт вашу индивидуальность.`,
};

type Props = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: Props) {
  return (
    <html lang="ru">
      <head>
        <style type="text/css">{mediaStyle}</style>
        <Script
          strategy="beforeInteractive"
          id="_next-gtm-init"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KZ8MJHPM');`,
          }}
        />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
      </head>

      <EffectorNext>
        <MediaContextProvider disableDynamicMediaQueries>
          <ViewportProvider>
            <body>
              <noscript>
                <iframe
                  src="https://www.googletagmanager.com/ns.html?id=GTM-KZ8MJHPM"
                  height="0"
                  width="0"
                  style={{ display: 'none', visibility: 'hidden' }}
                />
              </noscript>
              {children}
              <ProgressBar />
            </body>
          </ViewportProvider>
        </MediaContextProvider>
      </EffectorNext>
    </html>
  );
}
