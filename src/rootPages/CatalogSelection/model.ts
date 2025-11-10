import { createQuery } from '@farfetched/core';
import { invoke } from '@withease/factories';
import { sample } from 'effector';

import {
  CategoryInfoResponse,
  fetchFiltersSelection,
  fetchCatalogSelProducts,
  fetchCategoryBySlug,
  fetchSelectionInfo,
} from '@/shared/api/catalog';
import { declarePage } from '@/shared/pageRouting';

import { HOME_PAGE_FILTERS } from '@/constants/runtimeConfig';

import { validateFiltersToRequest } from '@/features/catalog/transformers';

import { pageStatusField } from '@/lib/status';

export const pageHooks = invoke(() => declarePage({ pageName: 'CatalogSelection' }));

export const catalogQuery = createQuery({
  handler: async ({
    selection,
    section,
    slug,
    page,
    ...params
  }: {
    brand: number;
    page: number;
    selection: string;
    section?: number;
    slug?: string;
  }) => {
    let category = null as CategoryInfoResponse | null;

    if (slug) {
      category = await fetchCategoryBySlug({ data: { slug } });
    }

    const filtersParams = { query: { ...params, section, selection, root_section: category?.id } };
    const catalogParams = { data: { limit: 60, ...params, category: section || category?.id, selection, page } };

    const [selectionInfo = null, catalog, filters] = await Promise.all([
      fetchSelectionInfo({ data: { selection } }),
      fetchCatalogSelProducts(catalogParams),
      fetchFiltersSelection(filtersParams),
    ]);

    return { selectionInfo, catalog, filters, category };
  },
});

sample({
  clock: pageHooks.entered,
  fn: ({ query, params }) => {
    return {
      page: query.page ? +query.page : 1,
      ...validateFiltersToRequest(query),
      brand: HOME_PAGE_FILTERS.female.brand,
      selection: params.selection,
      slug: params.slug,
    };
  },
  target: catalogQuery.start,
});

sample({ clock: catalogQuery.finished.failure, fn: () => 404, target: pageStatusField.change });