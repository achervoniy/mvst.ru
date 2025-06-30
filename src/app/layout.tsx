import { EffectorNext } from '@effector/next';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Script from 'next/script';

import { canonical } from '@/lib/meta';
import { ViewportProvider } from '@/lib/useViewport';

import { ProgressBar, MediaContextProvider, mediaStyle } from '@/ui/index';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '@/ui/themes/reset.scss';
import '@/ui/themes/fonts.scss';

type Props = Readonly<{
  children: React.ReactNode;
}>;

export async function generateMetadata() {
  const headersList = headers();

  return {
    openGraph: {
      type: 'website',
      images: ['https://mvst.ru/static/logo.png'],
      url: canonical(headersList.get('x-current-path')),
    },
    alternates: { canonical: canonical(headersList.get('x-current-path')) },
    title: 'MVST - купить мужскую и женскую одежду, обувь и аксессуары в официальном магазине',
    description: `MVST — официальный магазин модной одежды и аксессуаров для мужчин и женщин. Купить куртки, брюки, футболки, сумки и обувь с доставкой по России. Оригинальные вещи, гарантия качества, примерка перед покупкой. Новые коллекции 2025 года.`,
  } as Metadata;
}

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
        <link rel="dns-prefetch" href="//www.googletagmanager.com/" />
        <link rel="dns-prefetch" href="//mc.yandex.ru/" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'http://schema.org/',
              '@type': 'Organization',
              name: 'MVST',
              logo: 'https://mvst.ru/static/logo.png',
              url: 'https://mvst.ru/',
            }).replace(/</g, '\\u003c'),
          }}
        />
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
