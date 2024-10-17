import cn from 'classnames';
import { useEffect, useState } from 'react';

import { CategoryFilterCommonItem } from '@/shared/api/catalog';

import { useViewport } from '@/lib/useViewport';

import { Button, Typography } from '@/ui/index';

import { Icon } from '@/ui/assets/Icon';

import { pickLastNodeFromTrees } from '../../tree';
import { Filter, FilterValue } from '../types';
import { useAppliedFilters } from '../useAppliedFilters';

import catSt from './CategoryFilter.module.scss';
import st from '../Filters.module.scss';

type Props = {
  filter: Filter;
  hoveredItem: null | string;
  onMouseEnter: (_key: string) => void;
  leaveHandler: () => void;
  appliedFilters: ReturnType<typeof useAppliedFilters>;
};

type FilterContentProps = {
  items: CategoryFilterCommonItem[];
  appliedFilters: ReturnType<typeof useAppliedFilters>;
  filterKey: string;
  selectedCategoryIds: FilterValue[];
  clickedCategoryIds: FilterValue[];
  isLastLvl: boolean;
  changeSelectedCategory: (item: CategoryFilterCommonItem, index: number) => void;
  index: number;
};

function Content({
  items,
  appliedFilters,
  filterKey,
  selectedCategoryIds,
  clickedCategoryIds,
  isLastLvl,
  changeSelectedCategory,
  index,
}: FilterContentProps) {
  return (
    <ul className={cn(st.nav, catSt.category)}>
      {index > 1 && (
        <li key="back" className={catSt.backAction}>
          <Icon name="ArrowBack" />
          <Typography font="paragraph/regular">Назад</Typography>
        </li>
      )}

      {items.map(item => {
        const categorySelected = selectedCategoryIds.includes(item.value);
        const categoryClicked = clickedCategoryIds.includes(item.value);

        return (
          <li
            onClick={() => {
              if (!isLastLvl) {
                changeSelectedCategory(item, index);
              } else {
                appliedFilters.updateAppliedFilters({
                  key: filterKey,
                  filter: { ...item, items: [] },
                  selected: categorySelected,
                });
              }
            }}
            key={item.value}
            className={cn({
              [catSt.active]: categorySelected || categoryClicked,
              // [st.last]: index >= filter.filter.items.length - 4,
            })}
          >
            <Typography font="paragraph/regular">{item.title}</Typography>
            {!isLastLvl && <Icon name="ArrowRight" className={catSt.arrowRight} />}
            {categorySelected && <Icon name="CheckedIcon" />}
            <div className={st.separator} />
          </li>
        );
      })}
    </ul>
  );
}

export function CategoryFilter({ filter, hoveredItem, onMouseEnter, leaveHandler, appliedFilters }: Props) {
  const topCategories = filter.filter.items as CategoryFilterCommonItem[];

  const [selectedCategories, setSelectedCategories] = useState<CategoryFilterCommonItem[][]>([topCategories]);
  const [clickedCategoryIds, setClickedCategoryIds] = useState<FilterValue[]>([]);
  const { isTabletAndBelow } = useViewport();

  const changeSelectedCategory = (item: CategoryFilterCommonItem, index: number) => {
    setSelectedCategories([topCategories, ...selectedCategories.slice(1, index), item.items]);
    setClickedCategoryIds(index === 1 ? [item.value] : [clickedCategoryIds[0], item.value]);
  };

  useEffect(() => {
    if (hoveredItem === filter.title) {
      return () => {
        setSelectedCategories([topCategories]);
        setClickedCategoryIds([]);
      };
    }
  }, [filter.title, hoveredItem, topCategories]);

  if (filter.filter.items.length === 0) {
    return null;
  }

  const selectedCategoryIds = (appliedFilters.applied.section ?? []).map(pickLastNodeFromTrees).map(node => node.value);

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
          <div className={catSt.content}>
            <div className={catSt.contentWrapper}>
              {isTabletAndBelow ? (
                <Content
                  items={selectedCategories[selectedCategories.length - 1] as CategoryFilterCommonItem[]}
                  appliedFilters={appliedFilters}
                  filterKey={filter.key}
                  clickedCategoryIds={clickedCategoryIds}
                  selectedCategoryIds={selectedCategoryIds}
                  isLastLvl={selectedCategories[selectedCategories.length - 1][0]?.items.length === 0}
                  changeSelectedCategory={changeSelectedCategory}
                  index={selectedCategories.length}
                />
              ) : (
                selectedCategories.map((cat, index) => {
                  return (
                    <Content
                      key={index}
                      items={cat as CategoryFilterCommonItem[]}
                      appliedFilters={appliedFilters}
                      filterKey={filter.key}
                      clickedCategoryIds={clickedCategoryIds}
                      selectedCategoryIds={selectedCategoryIds}
                      isLastLvl={cat[0]?.items.length === 0}
                      changeSelectedCategory={changeSelectedCategory}
                      index={index + 1}
                    />
                  );
                })
              )}
            </div>

            <div className={catSt.footer}>
              <Button outline className={catSt.resetFiltersAction}>
                Сбросить настройки фильтров
              </Button>

              <Button
                filled
                stretch={isTabletAndBelow}
                onClick={() => {
                  appliedFilters.applyFilters(appliedFilters.applied);
                  leaveHandler();
                }}
              >
                Показать товары
              </Button>
            </div>
          </div>

          <div className={st.overlay} onMouseEnter={leaveHandler} />
        </div>
      )}
    </div>
  );
}
