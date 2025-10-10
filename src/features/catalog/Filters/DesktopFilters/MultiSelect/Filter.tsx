import cn from 'classnames';
import { useRef } from 'react';

import { usePopupState } from '@/lib/hooks';

import { Typography } from '@/ui/index';

import { Icon } from '@/ui/assets/Icon';

import { Filter } from '../../types';
import { useAppliedFilters } from '../../useAppliedFilters';
import { Popup } from '../Pane';

import { Content } from './Content';

import st from './styles.module.scss';

type Props = {
  filter: Filter;
  appliedFilters: ReturnType<typeof useAppliedFilters>;
};

export function MultiSelect({ filter, appliedFilters }: Props) {
  const popupRef = useRef(null);
  const { isOpen, closePopup, togglePopup } = usePopupState();

  const appliedWithoutDefault = filter.filter.applied?.filter?.(filter => !filter.isDefault) ?? [];

  const isSortFilter = filter.type === 'sort';
  const isFilterActive = isSortFilter ? appliedWithoutDefault.length > 0 : isOpen || appliedWithoutDefault.length > 0;

  return (
    <Popup
      tag={
        <div
          className={cn(st.tag, {
            [st.isOpen]: isFilterActive,
          })}
          onClick={togglePopup}
        >
          <Typography font="paragraph/regular">
            {isSortFilter ? (appliedWithoutDefault[0]?.title ?? filter.title ?? 'Сортировка') : filter.title}
            {appliedWithoutDefault.length > 0 && !isSortFilter && (
              <span className={st.counter}>{appliedWithoutDefault.length}</span>
            )}
          </Typography>
          {appliedWithoutDefault.length > 0 && !isSortFilter ? (
            <Icon
              name="CloseIcon"
              className={st.icon}
              onClick={e => {
                e.stopPropagation();
                appliedFilters.resetFilter(filter.key, appliedWithoutDefault);
              }}
            />
          ) : (
            <Icon name="Chevron" direction="top" className={st.icon} />
          )}
        </div>
      }
      isOpen={isOpen}
      closePopup={closePopup}
      ref={popupRef}
      align={filter.type === 'sort' ? 'end' : 'start'}
    >
      <Content filter={filter} appliedFilters={appliedFilters} closePopup={closePopup} />
    </Popup>
  );
}
