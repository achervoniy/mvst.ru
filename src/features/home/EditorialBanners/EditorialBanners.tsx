import cn from 'classnames';
import Link from 'next/link';

import { Typography } from '@/ui/index';

import { Icon } from '@/ui/assets/Icon';

import { HOME_PAGE_SELECTIONS } from '@/constants/runtimeConfig';

import { SectionHead } from '@/features/home/SectionHead';

import st from './styles.module.scss';

export function EditorialBanners() {
  if (HOME_PAGE_SELECTIONS.length === 0) return null;

  return (
    <section className={st.section}>
      <SectionHead eyebrow="редакция MVST" title="особые подборки" />

      <div className={st.grid}>
        {HOME_PAGE_SELECTIONS.map((tile, idx) => (
          <Link
            href={tile.href}
            key={`${tile.title}-${idx}`}
            className={cn(st.tile, st[tile.tone ?? 'dark'])}
            prefetch={false}
          >
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
