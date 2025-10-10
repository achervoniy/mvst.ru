'use client';
import cn from 'classnames';

import { Button, Typography } from '@/ui/index';

import { Icon } from '@/ui/assets/Icon';

import { Filter } from './types';
import { useAppliedFilters } from './useAppliedFilters';

import st from './Filters.module.scss';

// Просто хардкод что бы смочь вывести контент по колонка до упора
// Сверху вниз и слева на право

// Высота кнопки десктоп
const ACTION_HEIGHT = 85;
// Высота ячейки десктоп
const CELL_HEIGHT = 42;
// Макс высота меню по дизайну
const MAX_MENU_HEIGHT = 368;
// Макс кол-во колонок по дизайну
const MAX_COL_COUNT = 4;

function buildCells<Item>(list: Item[]) {
  let pushToCursor = 0;
  // 4ре колонки максимум по дизайну
  const cols = Array.from({ length: MAX_COL_COUNT }).map(() => []) as Item[][];
  let maxInColumn = Math.ceil((MAX_MENU_HEIGHT - ACTION_HEIGHT) / CELL_HEIGHT);

  list.forEach(item => {
    cols[pushToCursor].push(item);

    if (cols[pushToCursor]?.length >= maxInColumn) {
      if (pushToCursor + 1 >= cols.length) {
        maxInColumn += 1;
      }

      pushToCursor = pushToCursor + 1 >= cols.length ? 0 : pushToCursor + 1;
    }
  });

  return cols.filter(rows => rows.length > 0);
}

type Props = {
  filter: Filter;
  hoveredItem: null | string;
  onClick: (_key: string) => void;
  leaveHandler: () => void;
  appliedFilters: ReturnType<typeof useAppliedFilters>;
};

export function MultiSelectFilter({ filter, hoveredItem, onClick, leaveHandler, appliedFilters }: Props) {
  if (filter.filter.items.length === 0) {
    return null;
  }

  return (
    <div
      key={filter.title}
      className={cn(st.tag, {
        [st.hovered]: hoveredItem === filter.title,
        [st.sortTag]: filter.key === 'sort',
        [st.needToHide]: hoveredItem && filter.key === 'sort',
      })}
      onClick={() => onClick(filter.title)}
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
        <div className={st.inner}>
          <div className={st.navWrapper}>
            <div className={st.contentGrid}>
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
              </ul>

              {filter.type !== 'sort' && (
                <div className={st.action}>
                  <Button
                    stretch
                    filled
                    onClick={e => {
                      e.stopPropagation();
                      appliedFilters.applyFilters(appliedFilters.applied);
                      leaveHandler();
                    }}
                  >
                    Показать товары
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
