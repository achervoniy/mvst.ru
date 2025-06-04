declare module '*.svg?react' {
  import * as React from 'react';

  // const content: React.SVGProps<SVGSVGElement>;
  const content: React.VFC<React.SVGProps<SVGSVGElement>>;

  export default content;
}

// eslint-disable-next-line no-unused-vars
declare type Nullable<T> = T | null;

declare module '*.jpg' {
  import * as Next from 'next/image';

  const content: Next.StaticImageData;

  export default content;
}

type SeoMeta = {
  seoText?: string;
  seoTextMore?: string;
  seoTitle?: string;
};

type CatalogMeta = {
  canonicalUrl?: string;
};

declare type BaseMetaType = {
  title?: string;
  description?: string;
  keywords?: string;
  ogDescription?: string;
  ogTitle?: string;
  ogType?: string;
  ogImage: string[];
  ogImageAlt?: string;
  ogUrl?: string;
  ogImageSecureUrl?: string;
  twitterCard?: string;
  twitterImage: string[];
  twitterTitle?: string;
  twitterDescription?: string;
  ogAvailability?: string;
  elementImageTitle?: string;
  elementImageAlt?: string;
} & SeoMeta &
  CatalogMeta;

declare type GenerateMetaProps<T = any> = {
  params: T;
  searchParams: { [key: string]: string | string[] | undefined };
};