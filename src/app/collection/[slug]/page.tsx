import { EffectorNext } from '@effector/next';
import { AxiosResponse } from 'axios';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { CollectionPage as Page, pageHooks } from '@/rootPages/Collection';
import type { LooksResponse } from '@/shared/api/catalog';

import { LOOK_SLUGS } from '@/constants/runtimeConfig';

import { type PageProps, baseServices, createRSC } from '@/lib/rsc';

const rsc = createRSC({ pageHooks });

export async function generateMetadata({ params }: PageProps<{ slug: string }>): Promise<Metadata> {
  const url = `https://mvst.ru/collection/${params.slug}`;
  const hasSlug = [LOOK_SLUGS.men, LOOK_SLUGS.women].includes(params.slug);

  if (hasSlug) {
    const isMen = params.slug === LOOK_SLUGS.men;
    const title = isMen
      ? 'Мужская коллекция — стиль и комфорт на каждый день'
      : 'Женская коллекция — элегантность и яркость в каждой детали';
    const description = isMen
      ? 'Мужская коллекция MVST: элегантная и практичная одежда для активных мужчин, которые ценят качество и уникальность в каждом элементе гардероба.'
      : 'Женская коллекция MVST: идеальные наряды для любого события — от повседневных образов до вечерних мероприятий.';

    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: { title, description, url, type: 'website' },
      twitter: { card: 'summary_large_image', title, description },
    };
  }

  const { data: collection } = (await baseServices.api.tsum.get(
    `/v1/landing/${params.slug}`,
  )) as AxiosResponse<LooksResponse>;

  if (collection) {
    const description = collection.blocks.find(block => block.type === 'text')?.text;

    return {
      title: collection.title,
      description,
      alternates: { canonical: url },
      openGraph: { title: collection.title, description, url, type: 'website' },
      twitter: { card: 'summary_large_image', title: collection.title, description },
    };
  }

  return { alternates: { canonical: url } };
}

export default async function FashionPage(props: PageProps<{ slug: string }>) {
  const result = await rsc(props);

  if (result.is404) {
    notFound();
  }

  if (result.onRedirected) {
    result.onRedirected();
  }

  return (
    <EffectorNext values={result.values}>
      <Page />
    </EffectorNext>
  );
}
