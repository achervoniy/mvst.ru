import cn from 'classnames';
import { useRef, useState } from 'react';

import { FiltersResponse } from '@/shared/api/catalog';

import { useScrollEventListener } from '@/lib/hooks';

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

export function Filters({ filters }: Props) {
  const [scrollIsDown, setScrollIsDown] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const idRef = useRef<NodeJS.Timeout | null>(null);
  const appliedFilters = useAppliedFilters(filters);

  const additionalFilters = [
    { type: 'sort', filter: filters.sort, title: 'Сортировка', key: 'sort' },
    { type: 'variant', filter: filters.sort, title: 'Вариант', key: 'variant' },
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
  ] as Filter[];

  const leaveHandler = () => {
    setHoveredItem(null);
    clearTimeout(idRef.current!);
  };

  const onMouseEnter = (key: string) => {
    clearTimeout(idRef.current!);
    idRef.current = setTimeout(() => {
      setHoveredItem(key);
      appliedFilters.syncApplied();
    }, 300);
  };

  useScrollEventListener((_, { scrollDirection }) => {
    setScrollIsDown(scrollDirection === 'down');
  });

  return (
    <div
      onMouseLeave={leaveHandler}
      className={cn(st.filtersList, {
        [st.scrollIsDown]: scrollIsDown,
      })}
    >
      <div className={st.filterListContent}>
        {hoveredItem && (
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
                hoveredItem={hoveredItem}
                onMouseEnter={onMouseEnter}
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
                  key={`${attribute.key}/${attribute.title}`}
                  filter={{
                    title: attribute.title,
                    filter: { items: attribute.items, applied: appliedAttributes?.items ?? [] },
                    key: attribute.key,
                    type: 'attribute',
                  }}
                  hoveredItem={hoveredItem}
                  onMouseEnter={onMouseEnter}
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
              hoveredItem={hoveredItem}
              onMouseEnter={onMouseEnter}
              leaveHandler={leaveHandler}
              appliedFilters={appliedFilters}
            />
          );
        })}
      </div>
    </div>
  );
}