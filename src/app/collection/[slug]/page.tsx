import { EffectorNext } from '@effector/next';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { CollectionPage as Page, pageHooks } from '@/rootPages/Collection';

import { LOOK_SLUGS } from '@/constants/runtimeConfig';

import { type PageProps, createRSC } from '@/lib/rsc';

const rsc = createRSC({ pageHooks });

export async function generateMetadata({ params }: PageProps<{ slug: string }>): Promise<Metadata> {
  return {
    title:
      params.slug === LOOK_SLUGS.men
        ? 'Must Мужская Коллекция - Стиль и Комфорт на Каждый День'
        : 'Must Женская Коллекция - Элегантность и Яркость в Каждой Детали',
    description:
      params.slug === LOOK_SLUGS.men
        ? `Изучите Must Мужскую Коллекцию, где стиль встречает комфорт. Элегантная и практичная одежда для активных мужчин, которые ценят качество и уникальность в каждом элементе гардероба.`
        : `Погрузитесь в Must Женскую Коллекцию, где каждая вещь отражает ваш стиль. Найдите идеальные наряды для любого события — от повседневных образов до вечерних мероприятий.`,
  };
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
