import cn from 'classnames';
import Link from 'next/link';

import { Typography } from '@/ui/index';

import { Icon } from '@/ui/assets/Icon';

import { LOOK_SLUGS } from '@/constants/runtimeConfig';

import { SectionHead } from '@/features/home/SectionHead';

import st from './styles.module.scss';

type Tile = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  href: string;
  tone: 'dark' | 'cream' | 'ochre';
};

const TILES: Tile[] = [
  {
    eyebrow: 'весна-лето 26',
    title: 'новая коллекция',
    subtitle: 'Первая поставка SS26 уже в&nbsp;бутиках и&nbsp;онлайн',
    href: `/collection/${LOOK_SLUGS.all}`,
    tone: 'dark',
  },
  {
    eyebrow: 'тренд сезона',
    title: 'лён и хлопок',
    subtitle: 'Лёгкие природные ткани с&nbsp;характером',
    href: `/catalog/women`,
    tone: 'cream',
  },
  {
    eyebrow: 'классика',
    title: 'вязаный трикотаж',
    subtitle: 'Тонкая шерсть, кашемир, мерино',
    href: `/catalog/men`,
    tone: 'ochre',
  },
];

export function EditorialBanners() {
  if (TILES.length === 0) return null;

  return (
    <section className={st.section}>
      <SectionHead eyebrow="редакция MVST" title="особые подборки" />

      <div className={st.grid}>
        {TILES.map((tile, idx) => (
          <Link
            href={tile.href}
            key={`${tile.title}-${idx}`}
            className={cn(st.tile, st[tile.tone])}
            prefetch={false}
          >
            <span className={st.glow} aria-hidden />

            <div className={st.tileInner}>
              {tile.eyebrow && (
                <Typography font="body/bold" className={st.eyebrow}>
                  {tile.eyebrow}
                </Typography>
              )}
              <Typography font="leading/display" as="h2" className={st.title}>
                {tile.title}
              </Typography>
              {tile.subtitle && (
                <Typography
                  font="paragraph/regular"
                  className={st.subtitle}
                  dangerouslySetInnerHTML={{ __html: tile.subtitle }}
                />
              )}
              <span className={st.cta}>
                <Typography font="body/bold" className={st.ctaText}>
                  Смотреть
                </Typography>
                <Icon name="ArrowRight" className={st.ctaIcon} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
