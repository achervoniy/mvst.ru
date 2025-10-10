import cn from 'classnames';

import { FiltersResponse } from '@/shared/api/catalog';

import { ProductImageVariantFilter } from '../ProductImageVariantFilter';
import { Filter } from '../types';
import { useAppliedFilters } from '../useAppliedFilters';

import { MultiSelect } from './MultiSelect';

import st from './DesktopFilters.module.scss';

type Props = {
  filters: FiltersResponse;
};

export function DesktopFilters({ filters }: Props) {
  const appliedFilters = useAppliedFilters(filters);

  const additionalFilters = [
    // { type: 'sort', filter: filters.sort, title: 'Сортировка', key: 'sort' },
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
  ].filter(filter => filter.filter.items.length > 0) as Filter[];

  return (
    <div className={st.DesktopFilters}>
      <ul className={cn(st.FilterWrapper, {})}>
        {additionalFilters.map(filter => {
          switch (filter.type) {
            case 'attribute':
              return filter.filter.items.map(attribute => {
                const appliedAttributes = filter.filter.applied.find(attr => attr.title === attribute.title);

                return (
                  <li key={`${attribute.key}/${attribute.title}/${attribute.value}`}>
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

            default:
              return (
                <li key={filter.key} className={st[filter.type]}>
                  <MultiSelect filter={filter} appliedFilters={appliedFilters} />
                </li>
              );
          }
        })}

        {/* {hasAppliedFilters(appliedFilters.applied) && (
        <li>
          <Typography font="paragraph/regular" className={st.clearAction}>
            Очистить фильтры
          </Typography>
        </li>
      )} */}
      </ul>
      <div className={st.variant}>
        <ProductImageVariantFilter />
      </div>
    </div>
  );
}
