import { createQuery } from '@farfetched/core';
import { invoke } from '@withease/factories';
import { sample } from 'effector';

import { fetchBrandCatalog } from '@/shared/api/catalog';
import { declarePage } from '@/shared/pageRouting';

import { HOME_PAGE_FILTERS } from '@/constants/runtimeConfig';

export const catalogQuery = createQuery({
  handler: async (params: { page: number; limit: number }) => {
    const [men, women] = await Promise.all([
      fetchBrandCatalog({ data: { ...params, ...HOME_PAGE_FILTERS.men } }),
      fetchBrandCatalog({ data: { ...params, ...HOME_PAGE_FILTERS.female } }),
    ]);

    return {
      men,
      women,
    };
  },
});

export const pageHooks = invoke(() => declarePage({ pageName: 'HomePage' }));

sample({
  clock: pageHooks.entered,
  fn: () => ({ page: 1, limit: 100 }),
  target: catalogQuery.start,
});