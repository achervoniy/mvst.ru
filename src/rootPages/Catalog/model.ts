import { createQuery } from '@farfetched/core';
import { invoke } from '@withease/factories';
import { sample } from 'effector';

import { fetchBrandCatalog, fetchFiltersBrands } from '@/shared/api/catalog';
import { declarePage } from '@/shared/pageRouting';

import { HOME_PAGE_FILTERS } from '@/constants/runtimeConfig';

import { validateFiltersToRequest } from '@/features/catalog/transformers';

export const pageHooks = invoke(() => declarePage({ pageName: 'Catalog' }));

export const catalogQuery = createQuery({
  handler: async (params: { section: number; brand: number; page: number; color?: string }) => {
    const [catalog, filters] = await Promise.all([
      fetchBrandCatalog({ data: { limit: 60, ...params } }),
      fetchFiltersBrands({ query: { ...params } }),
    ]);

    return { catalog, filters };
  },
});

sample({
  clock: pageHooks.entered,
  fn: ({ url, query }) => ({
    ...(url?.endsWith('women') ? HOME_PAGE_FILTERS.female : HOME_PAGE_FILTERS.men),
    page: query.page ? +query.page : 1,
    ...validateFiltersToRequest(query),
  }),
  target: catalogQuery.start,
});