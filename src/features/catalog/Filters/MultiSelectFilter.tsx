import cn from 'classnames';

import { Button, Typography } from '@/ui/index';

import { Icon } from '@/ui/assets/Icon';

import { Filter } from './types';
import { useAppliedFilters } from './useAppliedFilters';

import st from './Filters.module.scss';

type Props = {
  filter: Filter;
  hoveredItem: null | string;
  onMouseEnter: (_key: string) => void;
  leaveHandler: () => void;
  appliedFilters: ReturnType<typeof useAppliedFilters>;
};

export function MultiSelectFilter({ filter, hoveredItem, onMouseEnter, leaveHandler, appliedFilters }: Props) {
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
          <div className={st.navWrapper}>
            <ul className={st.nav}>
              {filter.filter.items.map((item, index) => {
                const selected = !!appliedFilters.applied[filter.key]?.find(applied => applied.value === item.value);

                return (
                  <li
                    onClick={() => {
                      appliedFilters.updateAppliedFilters({
                        key: filter.key,
                        filter: { ...item, items: [] },
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
          </div>

          <div className={st.overlay} onMouseEnter={leaveHandler} />
        </div>
      )}
    </div>
  );
}
