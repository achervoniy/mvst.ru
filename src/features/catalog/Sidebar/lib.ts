import { CategoryFilterListCommonItem } from '@/shared/api/catalog';

export function hasOpenedChildren(category: CategoryFilterListCommonItem) {
  return category.items.some(it => it.items.length > 0);
}
