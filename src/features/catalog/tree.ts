import { CategoryFilterCommonItem, FiltersCommonItem } from '@/shared/api/catalog';

import { FilterValue } from './Filters/types';

export function pickLastNodeFromTrees<T extends CategoryFilterCommonItem | FiltersCommonItem<FilterValue>>(tree: T): T {
  const queue = [tree];
  let lastNode: Nullable<T> = null;

  while (queue.length > 0) {
    const currentCategory = queue.shift()!;

    if (currentCategory.items.length > 0) {
      // @ts-ignore
      queue.push({ ...currentCategory.items[0] });
    } else {
      lastNode = currentCategory;
    }
  }

  return lastNode!;
}

export function pickIdsFromTree(tree: CategoryFilterCommonItem[] | FiltersCommonItem<FilterValue>[]) {
  const queue = [...tree];
  const ids = [];

  while (queue.length > 0) {
    const currentCategory = queue.shift()!;

    if (currentCategory.items.length > 0) {
      queue.push({ ...currentCategory.items[0] });
    }

    ids.push(currentCategory.value);
  }

  return ids;
}

export function pickLastIdsFromTree(tree: CategoryFilterCommonItem[] | FiltersCommonItem<FilterValue>[]) {
  const queue = [...tree];
  const ids = [];

  while (queue.length > 0) {
    const currentCategory = queue.shift()!;

    if (currentCategory.items.length > 0) {
      queue.push(...currentCategory.items);
    }

    ids.push(currentCategory.value);
  }

  return ids;
}

export function findNodeFromTree(tree: CategoryFilterCommonItem, value: FilterValue) {
  const queue = [tree];

  while (queue.length > 0) {
    const currentCategory = queue.shift()!;

    if (currentCategory.value === value) {
      return true;
    }

    if (currentCategory.items.length > 0) {
      queue.push(...currentCategory.items);
    }
  }

  return false;
}
