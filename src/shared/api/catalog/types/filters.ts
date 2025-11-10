export type FetchFiltersParams = {
  root_section?: string | number;
  section?: string | number;
  selection?: string;
  q?: string;
  gender?: 'women' | 'men' | 'kids';
  brand?: string | number;
  color?: string;
  attribute?: string;
  size?: string;
  availability?: string;
  discount?: number;
  page: number;
  limit: number;
};

export interface FiltersCommonItem<Value = number> {
  key: string;
  value: Value;
  count: number;
  items: FiltersCommonItem<Value>[];
  title: string;
  isDefault?: boolean;
}

export interface FiltersBrandItem extends FiltersCommonItem {
  logo: string;
  is_top: 0 | 1;
}

export type FiltersCommonItemKV<Value = number> = Omit<FiltersCommonItem<Value>, 'count' | 'items' | 'title'>;

export interface CategoryFilterCommonItem extends FiltersCommonItem {
  slug: string;
  items: CategoryFilterCommonItem[];
}

export interface CategoryFilterListCommonItem extends FiltersCommonItem {
  slug: string;
  checked: Nullable<number>;
  items: CategoryFilterListCommonItem[];
}

export interface FiltersResponse {
  brand: {
    items: FiltersBrandItem[];
    applied: FiltersCommonItem[];
  };
  category: {
    items: CategoryFilterCommonItem[];
    applied: CategoryFilterCommonItem[];
    list: CategoryFilterListCommonItem[];
  };
  additional: {
    items: FiltersCommonItem[];
    applied: FiltersCommonItem[];
  };
  tag: {
    items: FiltersCommonItem[];
    applied: FiltersCommonItem[];
  };
  color: {
    items: FiltersCommonItem[];
    applied: FiltersCommonItem[];
  };
  sort: {
    items: (FiltersCommonItem & { isDefault: boolean })[];
    applied: (FiltersCommonItem & { isDefault: boolean })[];
  };
  size: {
    items: FiltersCommonItem[];
    applied: FiltersCommonItem[];
  };
  attribute: {
    items: (FiltersCommonItem & { items: FiltersCommonItem[] })[];
    applied: FiltersCommonItem[];
  };
  total: FiltersCommonItemKV & { info: boolean };
  availability_in_stock: FiltersCommonItemKV & { info: boolean };
  total_full: FiltersCommonItemKV & { info: boolean };
}
