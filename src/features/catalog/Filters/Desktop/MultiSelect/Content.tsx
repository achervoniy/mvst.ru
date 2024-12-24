import { Typography } from '@/ui/index';

import { Icon } from '@/ui/assets/Icon';

import { Filter } from '../../types';
import { useAppliedFilters } from '../../useAppliedFilters';

import st from './styles.module.scss';

type Props = {
  filter: Filter;
  appliedFilters: ReturnType<typeof useAppliedFilters>;
  closePopup: () => void;
};

export function Content({ filter, appliedFilters, closePopup }: Props) {
  return (
    <ul className={st.filtersContent}>
      {filter.filter.items.map(item => {
        const selected = !!appliedFilters.applied[filter.key]?.find(applied => applied.value === item.value);

        if (item.isDefault) {
          return null;
        }

        return (
          <li
            key={item.value}
            onClick={() => {
              appliedFilters.updateAppliedFilters({
                key: filter.key,
                filter: { ...item, items: [] },
                selected,
                applyImmediately: true,
              });

              if (filter.type === 'sort') {
                closePopup();
              }
            }}
          >
            <Typography font="paragraph/regular">{item.title}</Typography>
            {selected && <Icon name="CheckedIcon" className={st.checkedIcon} />}
          </li>
        );
      })}
    </ul>
  );
}
