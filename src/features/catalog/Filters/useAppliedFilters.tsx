import { usePathname } from 'next/navigation';
import { useRouter } from 'next-nprogress-bar';
import { useCallback, useEffect, useState } from 'react';

import { FiltersCommonItem, FiltersResponse } from '@/shared/api/catalog';

import { pickLastNodeFromTrees } from '../tree';

import { AppliedFilters, FilterValue } from './types';

const buildQueryString = (filters: AppliedFilters) => {
  const qs: string[] = [];

  if (filters.color.length > 0) {
    qs.push(`color=${filters.color.map(item => item.value).join(',')}`);
  }

  if (filters.size.length > 0) {
    qs.push(`size=${filters.size.map(item => item.value).join(',')}`);
  }

  if (filters.attribute.length > 0) {
    qs.push(`attribute=${filters.attribute.map(item => item.value).join(',')}`);
  }

  if (filters.section.length > 0) {
    qs.push(`section=${filters.section.map(filter => pickLastNodeFromTrees(filter).value).join(',')}`);
  }

  if (filters.sort.length > 0 && !filters.sort[0].isDefault) {
    qs.push(`sort=${filters.sort[0].value}`);
  }

  if (filters.additional.length > 0) {
    const labels: FilterValue[] = [];

    filters.additional.forEach(filter => {
      if (filter.key === 'labels') {
        labels.push(filter.value);
      } else {
        qs.push(`${filter.key}=${filter.value}`);
      }
    });

    if (labels.length > 0) {
      qs.push(`labels=${labels.join(',')}`);
    }
  }

  return qs.length > 0 ? `?${qs.join('&')}` : '';
};

export function useAppliedFilters(filters: FiltersResponse) {
  const [applied, setApplied] = useState<AppliedFilters>({} as AppliedFilters);
  const router = useRouter();
  const pathname = usePathname();

  const applyFilters = useCallback(
    (filters: AppliedFilters) => {
      const queryString = buildQueryString(filters);

      router.push(`${pathname}${queryString}`);
    },
    [pathname, router],
  );

  const updateAppliedFilters = useCallback(
    ({
      key,
      filter,
      selected,
      applyImmediately,
    }: {
      key: string;
      filter: FiltersCommonItem<FilterValue>;
      selected: boolean;
      applyImmediately?: boolean;
    }) => {
      const filters = {
        ...applied,
        [key]:
          key === 'sort'
            ? !selected
              ? [filter]
              : []
            : selected
              ? applied[key].filter(item => item.value !== filter.value)
              : [...applied[key], filter],
      };

      setApplied(filters);

      if (applyImmediately) {
        applyFilters(filters);
      }
    },
    [applied, applyFilters],
  );

  const syncApplied = useCallback(() => {
    setApplied({
      color: filters.color.applied,
      section: (filters.category.applied ?? []).map(pickLastNodeFromTrees),
      size: filters.size.applied,
      sort: filters.sort.applied,
      attribute: filters.attribute.applied.flatMap(applied => applied.items),
      additional: [...filters.additional.applied, ...filters.tag.applied],
    });
  }, [filters]);

  useEffect(() => {
    syncApplied();
  }, [syncApplied]);

  return { applied, updateAppliedFilters, syncApplied, applyFilters };
}
