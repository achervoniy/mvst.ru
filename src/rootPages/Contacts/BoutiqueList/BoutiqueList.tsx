'use client';

import Image from 'next/image';
import { useMemo } from 'react';

import { BOUTIQUES } from '@/shared/boutiques';

import { Typography } from '@/ui/index';

import st from './styles.module.scss';

export function BoutiqueList() {
  const groups = useMemo(() => {
    const map = new Map<string, typeof BOUTIQUES>();
    BOUTIQUES.forEach(b => {
      const arr = map.get(b.city) ?? [];
      arr.push(b);
      map.set(b.city, arr);
    });
    return Array.from(map.entries());
  }, []);

  return (
    <section className={st.BoutiqueList} target-id="boutique">
      <header className={st.head}>
        <Typography font="leading/h2" className={st.title} align="center">
          Бутики
        </Typography>
        <Typography font="paragraph/regular" className={st.intro} align="center">
          Шесть&nbsp;адресов&nbsp;— Москва и&nbsp;Санкт-Петербург. Приходите примерить,
          выбрать и&nbsp;познакомиться с&nbsp;коллекцией MVST лично.
        </Typography>
      </header>

      {groups.map(([city, items]) => (
        <div key={city} className={st.cityBlock}>
          <div className={st.cityTitleWrap}>
            <span className={st.cityRule} />
            <Typography font="paragraph/bold" className={st.cityTitle}>
              {city}
            </Typography>
            <span className={st.cityRule} />
          </div>

          <div className={st.grid}>
            {items.map(boutique => (
              <article key={boutique.id} className={st.card}>
                <div className={st.cardMedia}>
                  <Image
                    src={boutique.image}
                    alt={boutique.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className={st.cardImage}
                  />
                </div>
                <div className={st.cardBody}>
                  <Typography font="paragraph/bold" className={st.cardTitle}>
                    {boutique.title}
                  </Typography>
                  <p className={st.cardRow}>
                    <span className={st.cardLabel}>Адрес</span>
                    <span className={st.cardValue}>
                      {boutique.city}, {boutique.address}
                    </span>
                  </p>
                  <p className={st.cardRow}>
                    <span className={st.cardLabel}>Режим</span>
                    <span className={st.cardValue}>{boutique.schedule}</span>
                  </p>
                  {boutique.phone && (
                    <p className={st.cardRow}>
                      <span className={st.cardLabel}>Телефон</span>
                      <a className={st.cardValueLink} href={`tel:${boutique.phone.replace(/\D/g, '')}`}>
                        {boutique.phone}
                      </a>
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
