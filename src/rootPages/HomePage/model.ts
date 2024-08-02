import { createQuery } from '@farfetched/core';
import { invoke } from '@withease/factories';
import { sample } from 'effector';

import { fetchCatalog, FetchFiltersParams } from '@/shared/api/catalog';
import { createHooks } from '@/shared/pageRouting';

import { HOME_PAGE_SELECTIONS } from '@/constants/runtimeConfig';

export const catalogQuery = createQuery({
  handler: async (params: FetchFiltersParams) => {
    const [men, women] = await Promise.all([
      fetchCatalog({ data: { ...params, selection: HOME_PAGE_SELECTIONS.men } }),
      fetchCatalog({ data: { ...params, selection: HOME_PAGE_SELECTIONS.women } }),
    ]);

    return {
      men,
      women,
    };
  },
});

export const pageHooks = invoke(() => createHooks({ pageName: 'HomePage' }));

sample({
  clock: pageHooks.entered,
  fn: () => ({ page: 1, limit: 100 }),
  target: catalogQuery.start,
});