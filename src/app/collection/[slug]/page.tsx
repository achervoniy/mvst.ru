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
  const hasSlug = [LOOK_SLUGS.men, LOOK_SLUGS.women].includes(params.slug);

  if (hasSlug) {
    return {
      title:
        params.slug === LOOK_SLUGS.men
          ? 'MVST Мужская Коллекция - Стиль и Комфорт на Каждый День'
          : 'MVST Женская Коллекция - Элегантность и Яркость в Каждой Детали',
      description:
        params.slug === LOOK_SLUGS.men
          ? `Изучите MVST Мужскую Коллекцию, где стиль встречает комфорт. Элегантная и практичная одежда для активных мужчин, которые ценят качество и уникальность в каждом элементе гардероба.`
          : `Погрузитесь в MVST Женскую Коллекцию, где каждая вещь отражает ваш стиль. Найдите идеальные наряды для любого события — от повседневных образов до вечерних мероприятий.`,
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
    };
  }

  return {};
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
