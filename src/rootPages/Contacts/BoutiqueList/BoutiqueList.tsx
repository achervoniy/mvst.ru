'use client';

import { useMemo } from 'react';

import { type Boutique, useBoutiques } from '@/shared/boutiques';

import { Typography } from '@/ui/index';

import st from './styles.module.scss';

export function BoutiqueList() {
  const { boutiques, loading } = useBoutiques();

  const groups = useMemo(() => {
    const map = new Map<string, Boutique[]>();
    boutiques.forEach(b => {
      const arr = map.get(b.city) ?? [];
      arr.push(b);
      map.set(b.city, arr);
    });
    return Array.from(map.entries());
  }, [boutiques]);

  return (
    <section className={st.BoutiqueList} target-id="boutique">
      <header className={st.head}>
        <Typography font="leading/h2" className={st.title} align="center">
          Бутики
        </Typography>
        <Typography font="paragraph/regular" className={st.intro} align="center">
          {boutiques.length > 0
            ? <>{boutiques.length}&nbsp;адресов&nbsp;— Москва и&nbsp;Санкт-Петербург. Приходите примерить, выбрать и&nbsp;познакомиться с&nbsp;коллекцией MVST лично.</>
            : <>Приходите примерить, выбрать и&nbsp;познакомиться с&nbsp;коллекцией MVST лично.</>
          }
        </Typography>
      </header>

      {loading && boutiques.length === 0 && (
        <p style={{ textAlign: 'center', opacity: 0.5 }}>Загрузка…</p>
      )}

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
                  {boutique.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={absolutize(boutique.photoUrl)}
                      alt={boutique.title}
                      className={st.cardImage}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                    />
                  ) : null}
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
                  {boutique.schedule && (
                    <p className={st.cardRow}>
                      <span className={st.cardLabel}>Режим</span>
                      <span className={st.cardValue}>{boutique.schedule}</span>
                    </p>
                  )}
                  {boutique.phone && (
                    <p className={st.cardRow}>
                      <span className={st.cardLabel}>Телефон</span>
                      <a className={st.cardValueLink} href={`tel:${boutique.phone.replace(/\D/g, '')}`}>
                        {boutique.phone}
                      </a>
                    </p>
                  )}
                  {boutique.routeUrl && (
                    <p className={st.cardRow}>
                      <span className={st.cardLabel}>Маршрут</span>
                      <a
                        className={st.cardValueLink}
                        href={boutique.routeUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        Построить маршрут
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

function absolutize(url: string): string {
  if (!url) return url;
  if (/^https?:\/\//.test(url)) return url;
  const base = process.env.NEXT_PUBLIC_CRM_URL ?? '';
  return base ? `${base.replace(/\/$/, '')}${url}` : url;
}
