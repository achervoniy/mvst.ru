import { FiltersCommonItem, CategoryFilterCommonItem } from '@/shared/api/catalog';

export type FilterValue = string | number;

export type Filter =
  | { type: 'variant' }
  | {
      type: 'multiselect' | 'multiselect-separated' | 'sort' | 'attribute';
      filter: {
        items: FiltersCommonItem<FilterValue>[];
        applied: FiltersCommonItem<FilterValue>[];
      };
      title: string;
      key: string;
    }
  | {
      type: 'category';
      filter: {
        items: CategoryFilterCommonItem[];
        applied: CategoryFilterCommonItem[];
      };
      title: string;
      key: string;
    };

export type AppliedFilters = {
  [filter: string]: (FiltersCommonItem<FilterValue> & { isDefault?: boolean })[];
};

export interface UpdateFilter {
  key: string;
  value: FiltersCommonItem<FilterValue>[];
  keepPrevValue?: boolean;
}

export interface ClearFilter {
  key: string;
  value?: FiltersCommonItem<FilterValue>[];
}
