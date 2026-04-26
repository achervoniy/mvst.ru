import { useMemo } from 'react';

import Link from 'next/link';

import { FooterBrand } from './FooterBrand';

import {
  BOUTIQUE_INFO,
  DOWNLOAD_APP_LINK,
  LOOK_SLUGS,
  TSUM_SITE_LINK,
} from '@/constants/runtimeConfig';

import { Typography } from '@/ui/index';

import { Icon } from '@/ui/assets/Icon';

import st from './styles.module.scss';

type ColumnLink = { label: string; href: string; external?: boolean };

const COLLECTION_LINKS: ColumnLink[] = [
  { label: 'Коллекция SS26', href: `/collection/${LOOK_SLUGS.all}` },
  { label: 'Женская коллекция', href: `/collection/${LOOK_SLUGS.women}` },
  { label: 'Мужская коллекция', href: `/collection/${LOOK_SLUGS.men}` },
];

const CATALOG_LINKS: ColumnLink[] = [
  { label: 'Женщинам', href: '/catalog/women' },
  { label: 'Мужчинам', href: '/catalog/men' },
  { label: 'Образы с показа', href: '/catalog/women?labels=fashion_show' },
];

const ABOUT_LINKS: ColumnLink[] = [
  { label: 'О бренде', href: '/about' },
  { label: 'Наши бутики', href: '/contacts' },
  { label: 'Купить на tsum.ru', href: TSUM_SITE_LINK, external: true },
  { label: 'Приложение ЦУМ', href: DOWNLOAD_APP_LINK, external: true },
];

export function Footer() {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <div className={st.footer}>
      <div className={st.inner}>
      <div className={st.top}>
        <div className={st.brand}>
          <Link href="/" className={st.logo} aria-label="MVST">
            <Icon name="LogoFull" />
          </Link>
          <Typography font="paragraph/regular" className={st.tagline}>
            Элегантность вне&nbsp;времени. Женская и&nbsp;мужская коллекции
            MVST&nbsp;— безупречный крой, премиальные материалы
            и&nbsp;благородные оттенки.
          </Typography>
        </div>

        <FooterColumn title="Коллекция" links={COLLECTION_LINKS} />
        <FooterColumn title="Каталог" links={CATALOG_LINKS} />
        <FooterColumn title="Клиентам" links={ABOUT_LINKS} />

        <div className={st.column}>
          <Typography font="body/bold" className={st.columnTitle}>
            Контакты
          </Typography>
          <ul className={st.list}>
            <li>
              <Typography font="paragraph/regular" className={st.contactTitle}>
                {BOUTIQUE_INFO.title}
              </Typography>
            </li>
            <li>
              <Typography font="paragraph/regular" className={st.contactLine}>
                {BOUTIQUE_INFO.address}
              </Typography>
            </li>
            <li>
              <Typography font="paragraph/regular" className={st.contactLine}>
                {BOUTIQUE_INFO.hours}
              </Typography>
            </li>
            <li>
              <a href={`tel:${BOUTIQUE_INFO.phone.replace(/\s|\(|\)|-/g, '')}`} className={st.link}>
                <Typography font="paragraph/regular">{BOUTIQUE_INFO.phone}</Typography>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <FooterBrand />

      <hr className={st.rule} />

      <div className={st.bottom}>
        <Typography font="body/regular" className={st.legal}>
          © MVST. Все права защищены, {currentYear}
        </Typography>
        <div className={st.legalLinks}>
          <Link href="/about" className={st.legalLink}>
            <Typography font="body/regular">Политика конфиденциальности</Typography>
          </Link>
          <Link href="/about" className={st.legalLink}>
            <Typography font="body/regular">Оферта</Typography>
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
}

function FooterColumn({ title, links }: { title: string; links: ColumnLink[] }) {
  return (
    <div className={st.column}>
      <Typography font="body/bold" className={st.columnTitle}>
        {title}
      </Typography>
      <ul className={st.list}>
        {links.map(link =>
          link.external ? (
            <li key={link.label}>
              <a href={link.href} target="_blank" rel="noopener noreferrer" className={st.link}>
                <Typography font="paragraph/regular">{link.label}</Typography>
              </a>
            </li>
          ) : (
            <li key={link.label}>
              <Link href={link.href} className={st.link} prefetch={false}>
                <Typography font="paragraph/regular">{link.label}</Typography>
              </Link>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
