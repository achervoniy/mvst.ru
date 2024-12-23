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

  const hasApplied = appliedFilters.applied[filter.key]?.filter?.(filter => !filter.isDefault)?.length > 0;

  const isSortFilter = filter.type === 'sort';
  const isFilterActive = isSortFilter ? hasApplied : isOpen || hasApplied;
  const label = hasApplied ? `${filter.title} (${appliedFilters.applied[filter.key].length})` : filter.title;

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
            {isSortFilter ? appliedFilters.applied[filter.key]?.[0]?.title ?? filter.title : label}
          </Typography>
          <Icon name="Chevron" direction="top" className={st.icon} />
        </div>
      }
      isOpen={isOpen}
      closePopup={closePopup}
      ref={popupRef}
    >
      <Content filter={filter} appliedFilters={appliedFilters} closePopup={closePopup} />
    </Popup>
  );
}
