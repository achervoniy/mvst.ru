import type { StaticImageData } from 'next/image';

import barviha from '@/rootPages/Contacts/BoutiqueList/assets/must_barviha.jpg';
import dlt from '@/rootPages/Contacts/BoutiqueList/assets/must_dlt.jpg';
import raddison from '@/rootPages/Contacts/BoutiqueList/assets/must_raddison.jpg';
import td from '@/rootPages/Contacts/BoutiqueList/assets/must_td.jpg';
import tret from '@/rootPages/Contacts/BoutiqueList/assets/must_tret.jpg';
import tsum from '@/rootPages/Contacts/BoutiqueList/assets/must_tsum.jpg';

export type Boutique = {
  id: string;
  title: string;
  image: StaticImageData;
  city: 'Москва' | 'Санкт-Петербург';
  address: string;
  schedule: string;
  phone?: string;
};

export const BOUTIQUES: Boutique[] = [
  {
    id: 'tsum',
    title: 'ЦУМ',
    image: tsum,
    city: 'Москва',
    address: 'ул. Петровка, д. 2',
    schedule: 'Ежедневно 10:00 — 22:00',
    phone: '+7 (495) 933 73 00',
  },
  {
    id: 'barviha',
    title: 'Барвиха Luxury Village',
    image: barviha,
    city: 'Москва',
    address: 'Рублёво-Успенское шоссе, д. 114с7',
    schedule: 'Пн–Чт 11:00 — 22:00 · Пт–Вс 11:00 — 23:00',
    phone: '+7 (495) 225 88 55',
  },
  {
    id: 'tret',
    title: 'Третьяковский проезд',
    image: tret,
    city: 'Москва',
    address: 'Третьяковский проезд, д. 1',
    schedule: 'Пн–Чт 11:00 — 22:00 · Пт–Сб 11:00 — 23:00',
  },
  {
    id: 'raddison',
    title: 'Radisson Slavyanskaya',
    image: raddison,
    city: 'Москва',
    address: 'площадь Европы, 2',
    schedule: 'Ежедневно 11:00 — 22:00',
  },
  {
    id: 'kutuzovsky',
    title: 'Кутузовский, 31',
    image: td,
    city: 'Москва',
    address: 'Кутузовский проспект, д. 31',
    schedule: 'Ежедневно 11:00 — 22:00',
  },
  {
    id: 'dlt',
    title: 'ДЛТ',
    image: dlt,
    city: 'Санкт-Петербург',
    address: 'Большая Конюшенная ул., д. 21–23',
    schedule: 'Ежедневно 11:00 — 22:00',
  },
];

export function getBoutiqueById(id: string | null | undefined): Boutique | undefined {
  if (!id) return undefined;
  return BOUTIQUES.find(b => b.id === id);
}
