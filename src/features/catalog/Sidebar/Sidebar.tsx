import classNames from 'classnames';
import { isEmpty, omit } from 'es-toolkit/compat';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

import { CategoryFilterListCommonItem } from '@/shared/api/catalog';

import { Typography } from '@/ui/index';

import { Dropdown } from './Dropdown';

import st from './Sidebar.module.scss';

type Props = {
  categories: CategoryFilterListCommonItem[];
};

export function Sidebar({ categories }: Props) {
  const pathname = usePathname();
  const search = useSearchParams();

  const queriesWithoutPage = useMemo(() => {
    const q = omit(Object.fromEntries(search.entries()), 'page', 'section') as Record<string, string>;

    return !isEmpty(q) ? `?${new URLSearchParams(q)}` : '';
  }, [search]);

  const pathWithoutSlug = useMemo(() => {
    const path = pathname.split('/').filter(Boolean);

    return path.length > 2 ? `/${path.slice(0, 2).join('/')}` : `/${path.join('/')}`;
  }, [pathname]);

  return (
    <ul className={st.Sidebar}>
      {categories.map(cat => (
        <li
          key={cat.slug}
          className={classNames({
            [st.checked]: cat.items.length > 0,
          })}
        >
          <Link href={`${pathWithoutSlug}/${cat.slug}${queriesWithoutPage}`}>
            <Typography font="paragraph/regular">{cat.title}</Typography>
          </Link>

          {cat.items.length > 0 && <Dropdown category={cat} />}
        </li>
      ))}
    </ul>
  );
}
