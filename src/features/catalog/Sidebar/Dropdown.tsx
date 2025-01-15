import { isEqual, omit } from 'lodash-es';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next-nprogress-bar';
import { useEffect, useMemo, useState } from 'react';

import { CategoryFilterListCommonItem } from '@/shared/api/catalog';

import { Checkbox, Typography } from '@/ui/index';

import st from './Sidebar.module.scss';

type CheckedMap = Record<string | number, boolean>;

function listToCheckedMap(list: CategoryFilterListCommonItem[]) {
  return list.reduce((acc, it) => {
    if (typeof it.checked === 'number') {
      acc[it.value] = !!it.checked;
    }

    return acc;
  }, {} as CheckedMap);
}

export function Dropdown({ category }: { category: CategoryFilterListCommonItem }) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const [checkedMap, setCheckedCategories] = useState<CheckedMap>(() => listToCheckedMap(category.items));
  const rawQueries = useMemo(() => omit(Object.fromEntries(search.entries()), 'page', 'section'), [search]);

  useEffect(() => {
    const nextMap = listToCheckedMap(category.items);

    setCheckedCategories(prev => {
      if (!isEqual(nextMap, prev)) {
        return nextMap;
      }

      return prev;
    });
  }, [category.items]);

  return (
    <ul className={st.checkboxes}>
      {category.items.map(item => {
        const checked = !!checkedMap[item.value];

        return (
          <li key={item.slug}>
            <Checkbox
              checked={checked}
              onChange={e => {
                const nextSchemeMap = { ...checkedMap, [item.value]: !checked } as CheckedMap;
                const sections = Object.keys(nextSchemeMap).filter(key => nextSchemeMap[key]);

                e.stopPropagation();
                setCheckedCategories(nextSchemeMap);

                router.push(`${pathname}?${new URLSearchParams({ ...rawQueries, section: sections.join(',') })}`);
              }}
            >
              <Typography font="body/regular">{item.title}</Typography>
            </Checkbox>
          </li>
        );
      })}
    </ul>
  );
}
