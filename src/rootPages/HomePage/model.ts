import { createQuery } from '@farfetched/core';
import { invoke } from '@withease/factories';
import { sample } from 'effector';

import { fetchCatalog, FetchFiltersParams } from '@/shared/api/catalog';
import { createHooks } from '@/shared/pageRouting';

const SELECTIONS = {
  men: 'must-m',
  female: 'must-w',
};

export const catalogQuery = createQuery({
  handler: async (params: FetchFiltersParams) => {
    const [men, women] = await Promise.all([
      fetchCatalog({ data: { ...params, selection: SELECTIONS.men } }),
      fetchCatalog({ data: { ...params, selection: SELECTIONS.female } }),
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