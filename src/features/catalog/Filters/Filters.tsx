import cn from 'classnames';
import { useRef, useState } from 'react';

import { FiltersResponse } from '@/shared/api/catalog';

import { useScrollEventListener } from '@/lib/hooks';

import { Button, Typography } from '@/ui/index';

import { Icon } from '@/ui/assets/Icon';

import { Filter } from './types';
import { useAppliedFilters } from './useAppliedFilters';

import st from './Filters.module.scss';

type Props = {
  filters: FiltersResponse;
};

function FilterContent({
  filter,
  hoveredItem,
  onMouseEnter,
  leaveHandler,
  appliedFilters,
}: {
  filter: Filter;
  hoveredItem: null | string;
  onMouseEnter: (_key: string) => void;
  leaveHandler: () => void;
  appliedFilters: ReturnType<typeof useAppliedFilters>;
}) {
  if (filter.filter.items.length === 0) {
    return null;
  }

  return (
    <div
      key={filter.title}
      className={cn(st.tag, {
        [st.hovered]: hoveredItem === filter.title,
        [st.sortTag]: filter.key === 'sort',
      })}
      onMouseEnter={() => onMouseEnter(filter.title)}
    >
      {filter.key === 'sort' ? (
        <Icon name="SortIcon" className={st.sortIcon} />
      ) : (
        <>
          {filter.title}
          {filter.filter.applied?.length > 0 ? ` (${filter.filter.applied.length})` : ''}
        </>
      )}

      {hoveredItem === filter.title && (
        <div className={st.inner} onMouseLeave={leaveHandler}>
          <ul className={st.nav}>
            {filter.filter.items.map((item, index) => {
              const selected = !!appliedFilters.applied[filter.key]?.find(applied => applied.value === item.value);

              return (
                <li
                  onClick={() => {
                    appliedFilters.updateAppliedFilters({
                      key: filter.key,
                      filter: item,
                      selected,
                      applyImmediately: filter.type === 'sort',
                    });

                    if (filter.type === 'sort') {
                      leaveHandler();
                    }
                  }}
                  key={item.value}
                  className={cn({
                    [st.last]: index >= filter.filter.items.length - 4,
                  })}
                >
                  <Typography font="paragraph/regular">{item.title}</Typography>
                  {selected && <Icon name="CheckedIcon" />}
                </li>
              );
            })}

            {filter.type !== 'sort' && (
              <li className={st.action}>
                <Button
                  stretch
                  filled
                  onClick={() => {
                    appliedFilters.applyFilters(appliedFilters.applied);
                    leaveHandler();
                  }}
                >
                  Показать товары
                </Button>
              </li>
            )}
          </ul>

          <div className={st.overlay} onMouseEnter={leaveHandler} />
        </div>
      )}
    </div>
  );
}

export function Filters({ filters }: Props) {
  const [scrollIsDown, setScrollIsDown] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const idRef = useRef<NodeJS.Timeout | null>(null);
  const appliedFilters = useAppliedFilters(filters);

  const additionalFilters = [
    { type: 'sort', filter: filters.sort, title: 'Сортировка', key: 'sort' },
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
      {hoveredItem && (
        <div className={cn(st.tag, st.close)} onMouseEnter={leaveHandler}>
          <Icon name="CloseIcon" />
        </div>
      )}

      {additionalFilters.map(filter => {
        if (filter.type === 'attribute') {
          return filter.filter.items.map(attribute => {
            const appliedAttributes = filter.filter.applied.find(attr => attr.title === attribute.title);

            return (
              <FilterContent
                key={attribute.key}
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

        return (
          <FilterContent
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
  );
}