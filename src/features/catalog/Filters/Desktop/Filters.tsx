import cn from 'classnames';
import { useState } from 'react';

import { FiltersResponse } from '@/shared/api/catalog';

import { useScrollEventListener } from '@/lib/hooks';
import { useViewport } from '@/lib/useViewport';

import { ProductImageVariantFilter } from '../ProductImageVariantFilter';
import { Filter } from '../types';
import { useAppliedFilters } from '../useAppliedFilters';

import { MultiSelect } from './MultiSelect';

import st from './DesktopFilters.module.scss';

type Props = {
  filters: FiltersResponse;
};

export function DesktopFilters({ filters }: Props) {
  const [scrollIsDown, setScrollIsDown] = useState(false);
  const { isDesktop } = useViewport();
  const appliedFilters = useAppliedFilters(filters);

  const additionalFilters = [
    { type: 'sort', filter: filters.sort, title: 'Сортировка', key: 'sort' },
    { type: 'variant', filter: filters.sort, title: 'Сортировка', key: 'variant' },
    // В урл по типу хардкод
    { type: 'multiselect', filter: filters.color, title: 'Цвет', key: 'color' },
    { type: 'multiselect', filter: filters.size, title: 'Размер', key: 'size' },
    {
      type: 'attribute',
      filter: filters.attribute,
      title: 'attribute',
      key: 'attribute',
    },
    {
      // В урл по типу из items
      type: 'multiselect-separated',
      filter: {
        items: [...filters.additional.items, ...filters.tag.items],
        applied: [...filters.additional.applied, ...filters.tag.applied],
      },
      title: 'Другие',
      key: 'additional',
    },
  ] as Filter[];

  useScrollEventListener((_, { scrollDirection }) => {
    if (isDesktop) {
      setScrollIsDown(scrollDirection === 'down');
    }
  });

  return (
    <ul
      className={cn(st.FilterWrapper, {
        [st.scrollIsDown]: scrollIsDown,
      })}
    >
      {additionalFilters.map(filter => {
        switch (filter.type) {
          case 'attribute':
            return filter.filter.items.map(attribute => {
              const appliedAttributes = filter.filter.applied.find(attr => attr.title === attribute.title);

              return (
                <li key={`${attribute.key}/${attribute.title}`}>
                  <MultiSelect
                    appliedFilters={appliedFilters}
                    filter={{
                      title: attribute.title,
                      filter: { items: attribute.items, applied: appliedAttributes?.items ?? [] },
                      key: attribute.key,
                      type: 'attribute',
                    }}
                  />
                </li>
              );
            });

          case 'variant':
            return (
              <li key={filter.type} className={st[filter.type]}>
                <ProductImageVariantFilter />
              </li>
            );

          default:
            return (
              <li key={filter.key} className={st[filter.type]}>
                <MultiSelect filter={filter} appliedFilters={appliedFilters} />
              </li>
            );
        }
      })}
    </ul>
  );
}
