import cn from 'classnames';

import { Button, Typography } from '@/ui/index';

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

function Content({
  filter,
  appliedFilters,
  leaveHandler,
}: {
  filter: Filter;
  appliedFilters: ReturnType<typeof useAppliedFilters>;
  leaveHandler: () => void;
}) {
  return (
    <ul className={st.nav}>
      {filter.filter.items.map((item, index) => {
        return (
          <li
            onClick={() => {
              appliedFilters.updateAppliedFilters({
                key: filter.key,
                filter: { ...item, items: [] },
                selected: false,
                applyImmediately: filter.type === 'sort',
              });
            }}
            key={item.value}
            className={cn({
              [st.last]: index >= filter.filter.items.length - 4,
            })}
          >
            <Typography font="paragraph/regular">{item.title}</Typography>
          </li>
        );
      })}

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
    </ul>
  );
}

export function CategoryFilter({ filter, hoveredItem, onMouseEnter, leaveHandler, appliedFilters }: Props) {
  if (filter.filter.items.length === 0) {
    return null;
  }

  return (
    <div
      key={filter.title}
      className={cn(st.tag, {
        [st.hovered]: hoveredItem === filter.title,
      })}
      onMouseEnter={() => onMouseEnter(filter.title)}
    >
      {filter.title}
      {filter.filter.applied?.length > 0 ? ` (${filter.filter.applied.length})` : ''}

      {hoveredItem === filter.title && (
        <div className={st.inner} onMouseLeave={leaveHandler}>
          <Content filter={filter} appliedFilters={appliedFilters} leaveHandler={leaveHandler} />

          <div className={st.overlay} onMouseEnter={leaveHandler} />
        </div>
      )}
    </div>
  );
}
