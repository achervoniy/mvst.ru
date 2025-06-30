import Head from 'next/head';
import Link from 'next/link';

import { CategoryInfoResponse } from '@/shared/api/catalog';

import { HOME_PAGE_FILTERS } from '@/constants/runtimeConfig';

import { Typography } from '@/ui/index';

import st from './styles.module.scss';

const links = ({ gender, category }: { gender?: 'w' | 'm'; category?: CategoryInfoResponse }) => {
  const isRootPage =
    category && [HOME_PAGE_FILTERS.female.section, HOME_PAGE_FILTERS.men.section].includes(category.id);

  return [
    {
      title: 'Главная',
      link: '/',
    },
    {
      title: gender === 'w' ? 'Женское' : 'Мужское',
      ...(!isRootPage ? { link: gender === 'w' ? '/catalog/women' : '/catalog/men' } : {}),
    },
    !isRootPage && {
      title: category?.title,
    },
  ].filter(Boolean) as { title: string; link?: string }[];
};

export function Breadcrumbs({ gender, category }: { gender?: 'w' | 'm'; category?: CategoryInfoResponse }) {
  return (
    <ol className={st.Breadcrumbs} itemScope itemType="https://schema.org/BreadcrumbList">
      {links({ gender, category }).map((link, index, arr) => {
        const content = (
          <Typography font="body/regular" itemProp="name">
            {link.title}
            {arr.length - 1 > index ? <>&nbsp;&nbsp;•&nbsp;&nbsp;</> : ''}
          </Typography>
        );
        const meta = <meta itemProp="position" content={String(index + 1)} />;
        return link.link ? (
          <li key={index} itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link href={link.link ?? '#'} itemProp="item">
              {content}
            </Link>
            {meta}
          </li>
        ) : (
          <li key={index}>
            {content}
            {meta}
          </li>
        );
      })}
    </ol>
  );
}