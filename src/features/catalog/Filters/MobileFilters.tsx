import cn from 'classnames';
import { useState } from 'react';

import { FiltersResponse } from '@/shared/api/catalog';

import { Icon } from '@/ui/assets/Icon';

import { CategoryFilter } from './CategoryFilter';
import { MultiSelectFilter } from './MultiSelectFilter';
import { ProductImageVariantFilter } from './ProductImageVariantFilter';
import { Filter } from './types';
import { useAppliedFilters } from './useAppliedFilters';

import st from './Filters.module.scss';

type Props = {
  filters: FiltersResponse;
};

export function MobileFilters({ filters }: Props) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const appliedFilters = useAppliedFilters(filters);

  const additionalFilters = [
    // { type: 'sort', filter: filters.sort, title: 'Сортировка', key: 'sort' },
    {
      type: 'category',
      filter: { items: filters.category.items, applied: filters.category.applied },
      title: 'Категория',
      key: 'section',
    },
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
    { type: 'variant', filter: filters.sort, title: '', key: 'variant' },
  ] as Filter[];

  const leaveHandler = () => {
    setActiveFilter(null);
    appliedFilters.syncApplied();
  };

  const onClick = (key: string) => {
    setActiveFilter(key);
  };

  return (
    <div className={cn(st.MobileFilters, {})}>
      <div className={st.filterListContent}>
        {activeFilter && (
          <div className={cn(st.tag, st.close)} onClick={leaveHandler}>
            <Icon name="CloseIcon" />
          </div>
        )}

        {additionalFilters.map(filter => {
          if (filter.type === 'category') {
            return (
              <CategoryFilter
                key={filter.key}
                filter={filter}
                activeFilter={activeFilter}
                onClick={onClick}
                leaveHandler={leaveHandler}
                appliedFilters={appliedFilters}
              />
            );
          }

          if (filter.type === 'attribute') {
            return filter.filter.items.map(attribute => {
              const appliedAttributes = filter.filter.applied.find(attr => attr.title === attribute.title);

              return (
                <MultiSelectFilter
                  key={`${attribute.key}/${attribute.title}/${attribute.value}`}
                  filter={{
                    title: attribute.title,
                    filter: { items: attribute.items, applied: appliedAttributes?.items ?? [] },
                    key: attribute.key,
                    type: 'attribute',
                  }}
                  hoveredItem={activeFilter}
                  onClick={onClick}
                  leaveHandler={leaveHandler}
                  appliedFilters={appliedFilters}
                />
              );
            });
          }

          if (filter.type === 'variant') {
            return <ProductImageVariantFilter key="variant" />;
          }

          return (
            <MultiSelectFilter
              key={filter.key}
              filter={filter}
              hoveredItem={activeFilter}
              onClick={onClick}
              leaveHandler={leaveHandler}
              appliedFilters={appliedFilters}
            />
          );
        })}
      </div>
    </div>
  );
}