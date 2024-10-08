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

export function flattenTree(tree: FiltersCommonItem[] | FiltersCommonItem<FilterValue>) {
  const queue = Array.isArray(tree) ? [...tree] : [tree];
  const map: Record<string | number, boolean> = {};

  while (queue.length > 0) {
    const currentCategory = queue.shift()!;

    map[currentCategory.value] = true;

    if (currentCategory?.items?.length > 0) {
      queue.push(...currentCategory.items);
    }
  }

  return map;
}

/*
  Получить вершины по checked свойству
  Из дерева точено выбрать элементы и сделать список
  Получается hydrateTreeFromList на оборот
*/
export function pickAllItemsByChecked({
  tree,
  checkedMap,
}: {
  tree: Array<FiltersCommonItem>;
  checkedMap: Record<string | number, boolean>;
}) {
  const queue = [...tree];
  const result = [];

  while (queue.length > 0) {
    const currentCategory = queue.shift()!;

    if (checkedMap[currentCategory.value]) {
      if (currentCategory.items) {
        queue.push(...currentCategory.items);
      }

      result.push(currentCategory);
    }
  }

  return result;
}
