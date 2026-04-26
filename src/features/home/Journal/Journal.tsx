import Link from 'next/link';

import { Icon } from '@/ui/assets/Icon';

import { SectionHead } from '@/features/home/SectionHead';

import st from './styles.module.scss';

type Tone = 'thumb_a' | 'thumb_b' | 'thumb_c';
type Article = { eyebrow: string; title: string; meta: string; tone: Tone; href: string };

const articles: Article[] = [
  {
    eyebrow: 'интервью',
    title: 'разговор с главным закройщиком: что такое крой mvst',
    meta: '8 мин · март 2026',
    tone: 'thumb_a',
    href: '#',
  },
  {
    eyebrow: 'процесс',
    title: 'как мы выбираем лён в Тоскане',
    meta: '6 мин · март 2026',
    tone: 'thumb_b',
    href: '#',
  },
  {
    eyebrow: 'архив',
    title: 'десять вещей, которые остаются с нами с 2018',
    meta: '12 мин · февраль 2026',
    tone: 'thumb_c',
    href: '#',
  },
];

export function Journal() {
  return (
    <section className={st.journal}>
      <SectionHead eyebrow="журнал" title="мир mvst" align="center" />

      <div className={st.grid}>
        {articles.map((a, i) => (
          <Link key={i} href={a.href} className={st.card} prefetch={false}>
            <div className={st[a.tone]} aria-hidden />
            <span className={st.cardEyebrow}>{a.eyebrow}</span>
            <h3 className={st.cardTitle}>{a.title}</h3>
            <span className={st.meta}>
              <span>{a.meta}</span>
              <Icon name="ArrowRight" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
