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
    <div className={st.Breadcrumbs}>
      {links({ gender, category }).map((link, index, arr) => {
        return (
          <Link href={link.link ?? '#'} key={link.link}>
            <Typography font="body/regular">
              {link.title}
              {arr.length - 1 > index ? <>&nbsp;&nbsp;•&nbsp;&nbsp;</> : ''}
            </Typography>
          </Link>
        );
      })}
    </div>
  );
}