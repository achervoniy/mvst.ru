import cn from 'classnames';
import { useEffect, useMemo, useState } from 'react';

import { CategoryFilterCommonItem } from '@/shared/api/catalog';

import { Button, Typography } from '@/ui/index';

import { Icon } from '@/ui/assets/Icon';

import { pickLastIdsFromTree, pickLastNodeFromTrees } from '../../tree';
import { Filter, FilterValue } from '../types';
import { useAppliedFilters } from '../useAppliedFilters';

import catSt from './CategoryFilter.module.scss';
import st from '../Filters.module.scss';

type Props = {
  filter: Filter;
  activeFilter: null | string;
  onClick: (_key: string) => void;
  leaveHandler: () => void;
  appliedFilters: ReturnType<typeof useAppliedFilters>;
};

type FilterContentProps = {
  items: CategoryFilterCommonItem[];
  isLastLvl: boolean;
  changeSelectedCategory: (_item: CategoryFilterCommonItem, _index: number) => void;
  index: number;
  goBack: () => void;
  setDraftFilters: (_items: CategoryFilterCommonItem[]) => void;
  draftFilters: CategoryFilterCommonItem[];
  isSameFilters: boolean;
};

function Content({
  items,
  isLastLvl,
  changeSelectedCategory,
  index,
  goBack,
  draftFilters,
  setDraftFilters,
  isSameFilters,
}: FilterContentProps) {
  return (
    <ul className={cn(st.nav, catSt.category)}>
      {index > 1 && (
        <li key="back" className={catSt.backAction} onClick={goBack}>
          <Icon name="ArrowBack" />
          <Typography font="paragraph/regular">Назад</Typography>
        </li>
      )}

      {items.map((item, idx) => {
        const categorySelected =
          draftFilters.some(filter => filter.value === item.value) ||
          pickLastIdsFromTree([item]).some(id => draftFilters.some(filter => filter.value === id));

        return (
          <li
            onClick={() => {
              if (!isLastLvl) {
                changeSelectedCategory(item, index);
              } else {
                if (!isSameFilters) {
                  setDraftFilters([item]);
                } else {
                  setDraftFilters(
                    categorySelected
                      ? draftFilters.filter(filter => filter.value !== item.value)
                      : [...draftFilters, item],
                  );
                }
              }
            }}
            key={item.value}
            className={cn({
              [catSt.active]: categorySelected,
            })}
          >
            <Typography font="paragraph/regular">{item.title}</Typography>
            {categorySelected && <Icon name="CheckedIcon" />}
            {idx < items.length - 1 && <div className={st.separator} />}
          </li>
        );
      })}
    </ul>
  );
}

export function CategoryFilter({ filter, activeFilter, onClick, leaveHandler, appliedFilters }: Props) {
  const topCategories = filter.filter.items as CategoryFilterCommonItem[];

  const [selectedCategories, setSelectedCategories] = useState<CategoryFilterCommonItem[][]>([topCategories]);
  const [clickedCategoryIds, setClickedCategoryIds] = useState<FilterValue[]>([]);
  const [draftFilters, setDraftFilters] = useState<CategoryFilterCommonItem[]>([]);

  const appliedSectionCategories = useMemo(
    () => appliedFilters.applied.section ?? [],
    [appliedFilters.applied.section],
  ) as CategoryFilterCommonItem[];

  const isLastLvl = selectedCategories[selectedCategories.length - 1]?.[0]?.items.length === 0;
  const isFirstLvl = selectedCategories.length <= 1;
  const isSameFilters =
    isLastLvl &&
    (draftFilters.length === 0 ||
      draftFilters.some(filter =>
        ((selectedCategories[selectedCategories.length - 1] as CategoryFilterCommonItem[]) ?? []).some(
          item => item.value === filter.value,
        ),
      ));

  const changeSelectedCategory = (item: CategoryFilterCommonItem, index: number) => {
    setSelectedCategories([topCategories, ...selectedCategories.slice(1, index), item.items]);
    setClickedCategoryIds(index === 1 ? [item.value] : [clickedCategoryIds[0], item.value]);
  };

  const goBack = () => {
    setSelectedCategories(selectedCategories.slice(0, -1));
    setClickedCategoryIds(clickedCategoryIds.slice(0, -1));
    setDraftFilters(appliedSectionCategories.map(pickLastNodeFromTrees));
  };

  useEffect(() => {
    if (activeFilter === filter.title) {
      setDraftFilters(appliedSectionCategories.map(pickLastNodeFromTrees));

      return () => {
        setSelectedCategories([topCategories]);
        setClickedCategoryIds([]);
      };
    }
  }, [filter.title, activeFilter, topCategories, appliedSectionCategories]);

  if (filter.filter.items.length === 0) {
    return null;
  }

  return (
    <div key={filter.title} className={cn(st.tag, {})} onClick={() => onClick(filter.title)}>
      {filter.title}
      {filter.filter.applied?.length > 0 ? ` (${filter.filter.applied.length})` : ''}

      {activeFilter === filter.title && (
        <div className={st.inner}>
          <div className={catSt.content}>
            <div className={catSt.contentWrapper}>
              <Content
                isSameFilters={isSameFilters}
                items={selectedCategories[selectedCategories.length - 1] as CategoryFilterCommonItem[]}
                isLastLvl={isLastLvl}
                changeSelectedCategory={changeSelectedCategory}
                index={selectedCategories.length}
                goBack={goBack}
                draftFilters={draftFilters}
                setDraftFilters={setDraftFilters}
              />
            </div>

            <div className={catSt.footer}>
              <Button
                filled
                stretch
                onClick={e => {
                  e.stopPropagation();

                  if (isLastLvl && isSameFilters && draftFilters.length > 0) {
                    appliedFilters.applyFilters({ ...appliedFilters.applied, [filter.key]: draftFilters });
                  } else if (!isFirstLvl) {
                    appliedFilters.applyFilters({
                      ...appliedFilters.applied,
                      [filter.key]: [
                        {
                          ...filter.filter.items[0],
                          items: [],
                          value: clickedCategoryIds[clickedCategoryIds.length - 1],
                        },
                      ],
                    });
                  }

                  leaveHandler();
                }}
              >
                Показать товары
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
