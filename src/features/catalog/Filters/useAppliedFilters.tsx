import { usePathname } from 'next/navigation';
import { useRouter } from 'next-nprogress-bar';
import { useCallback, useEffect, useState } from 'react';

import { FiltersCommonItem, FiltersResponse } from '@/shared/api/catalog';

import { AppliedFilters, FilterValue } from './types';

export function useAppliedFilters(filters: FiltersResponse) {
  const [applied, setApplied] = useState({} as AppliedFilters);
  const router = useRouter();
  const pathname = usePathname();

  const applyFilters = useCallback(
    (filters: AppliedFilters) => {
      const qs = [];

      if (filters.color.length > 0) {
        qs.push(`color=${filters.color.map(item => item.value).join(',')}`);
      }

      if (filters.size.length > 0) {
        qs.push(`size=${filters.size.map(item => item.value).join(',')}`);
      }

      if (filters.attribute.length > 0) {
        qs.push(`attribute=${filters.attribute.map(item => item.value).join(',')}`);
      }

      if (filters.sort.length > 0 && !filters.sort[0].isDefault) {
        qs.push(`sort=${filters.sort[0].value}`);
      }

      if (filters.additional.length > 0) {
        const labels = [] as FilterValue[];

        filters.additional.forEach(filter => {
          if (filter.key === 'labels') {
            labels.push(filter.value);
          } else {
            // as is
            qs.push(`${filter.key}=${filter.value}`);
          }
        });

        if (labels.length > 0) {
          qs.push(`labels=${labels.join(',')}`);
        }
      }

      router.push(`${pathname}${qs.length > 0 ? `?${qs.join('&')}` : ''}`);
    },
    [pathname, router],
  );

  const updateAppliedFilters = useCallback(
    (params: {
      key: string;
      filter: FiltersCommonItem<FilterValue>;
      selected: boolean;
      applyImmediately?: boolean;
    }) => {
      let filters = {} as AppliedFilters;

      if (params.key === 'sort') {
        filters = {
          ...applied,
          [params.key]: !params.selected ? [params.filter] : [],
        };
      } else if (typeof applied[params.key] !== 'undefined') {
        filters = {
          ...applied,
          [params.key]: !params.selected
            ? [...applied[params.key], params.filter]
            : applied[params.key].filter(item => item.value !== params.filter.value),
        };
      }

      setApplied(filters);

      if (params.applyImmediately) {
        applyFilters(filters);
      }
    },
    [applied, applyFilters],
  );

  const syncApplied = useCallback(() => {
    setApplied({
      color: filters.color.applied,
      size: filters.size.applied,
      sort: filters.sort.applied,
      attribute: filters.attribute.applied.reduce(
        (acc, applied) => [...acc, ...applied.items],
        [] as FiltersCommonItem<FilterValue>[],
      ),
      additional: [...filters.additional.applied, ...filters.tag.applied],
    });
  }, [filters]);

  useEffect(() => {
    syncApplied();
  }, [syncApplied]);

  return { applied, updateAppliedFilters, syncApplied, applyFilters };
}
