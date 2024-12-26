import Link from 'next/link';

import { Typography } from '@/ui/index';

import st from './styles.module.scss';

const links = (gender?: 'w' | 'm') =>
  [
    {
      title: 'Главная',
      link: '/',
    },
    gender && {
      title: 'Каталог',
      link: gender === 'w' ? '/catalog/women' : '/catalog/men',
    },
  ].filter(Boolean) as { title: string; link: string }[];

export function Breadcrumbs({ gender }: { gender?: 'w' | 'm' }) {
  return (
    <div className={st.Breadcrumbs}>
      {links(gender).map((link, index, arr) => (
        <Link href={link.link} key={link.link}>
          <Typography font="body/regular">
            {link.title}
            {arr.length - 1 > index ? <>&nbsp;&nbsp;•&nbsp;&nbsp;</> : ''}
          </Typography>
        </Link>
      ))}
    </div>
  );
}