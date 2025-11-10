import classNames from 'classnames';
import { isEmpty, omit } from 'es-toolkit/compat';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

import { CategoryFilterListCommonItem } from '@/shared/api/catalog';

import { Typography } from '@/ui/index';

import { Dropdown } from './Dropdown';
import { hasOpenedChildren } from './lib';

import st from './Sidebar.module.scss';

type Props = {
  categories: CategoryFilterListCommonItem[];
  isInner?: boolean;
  selection?: string;
};

export function Sidebar({ categories, isInner, selection }: Props) {
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
    <ul
      className={classNames(st.Sidebar, {
        [st.isInner]: isInner,
      })}
    >
      {categories.map(cat => {
        const type = typeof cat.items[0]?.checked === 'number' ? 'variants' : 'link';
        const someAreOpened = hasOpenedChildren(cat);
        const link = selection
          ? `${pathWithoutSlug}/${selection}/${cat.slug}${queriesWithoutPage}`
          : `${pathWithoutSlug}/${cat.slug}${queriesWithoutPage}`;

        return (
          <li
            key={cat.slug}
            className={classNames({
              [st.active]: cat.items.length > 0,
              [st.transparent]: someAreOpened,
            })}
          >
            <Link href={link}>
              <Typography font="paragraph/regular">{cat.title}</Typography>
            </Link>

            {cat.items.length > 0 &&
              (type === 'link' ? <Sidebar categories={cat.items} isInner /> : <Dropdown category={cat} />)}
          </li>
        );
      })}
    </ul>
  );
}
