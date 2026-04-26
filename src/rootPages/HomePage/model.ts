import { createQuery } from '@farfetched/core';
import { invoke } from '@withease/factories';
import { sample } from 'effector';

import { fetchLanding } from '@/shared/api';
import { fetchBrandCatalog } from '@/shared/api/catalog';
import { declarePage } from '@/shared/pageRouting';

import { HOME_PAGE_FILTERS, LOOK_SLUGS } from '@/constants/runtimeConfig';

type PageParams = { page: number; limit: number };

// Бестселлеры / базовый каталог для главной
export const catalogQuery = createQuery({
  handler: async (params: PageParams) => {
    const [men, women] = await Promise.all([
      fetchBrandCatalog({ data: { ...params, ...HOME_PAGE_FILTERS.men } }),
      fetchBrandCatalog({ data: { ...params, ...HOME_PAGE_FILTERS.female } }),
    ]);

    return { men, women };
  },
});

// Новинки — сортировка по дате поступления
export const newArrivalsQuery = createQuery({
  handler: async (params: PageParams) => {
    const [men, women] = await Promise.all([
      fetchBrandCatalog({
        data: { ...params, ...HOME_PAGE_FILTERS.men, sort: 'date' },
      }),
      fetchBrandCatalog({
        data: { ...params, ...HOME_PAGE_FILTERS.female, sort: 'date' },
      }),
    ]);

    return { men, women };
  },
});

// Товары из показа
export const fashionShowQuery = createQuery({
  handler: async (params: PageParams) => {
    const [men, women] = await Promise.all([
      fetchBrandCatalog({
        data: { ...params, ...HOME_PAGE_FILTERS.men, labels: 'fashion_show' },
      }),
      fetchBrandCatalog({
        data: { ...params, ...HOME_PAGE_FILTERS.female, labels: 'fashion_show' },
      }),
    ]);

    return { men, women };
  },
});

// Образы из лукбука SS26
export const looksQuery = createQuery({
  handler: async () => {
    const rs = await fetchLanding({ data: { slug: LOOK_SLUGS.all } });

    return rs;
  },
});

export const pageHooks = invoke(() => declarePage({ pageName: 'HomePage' }));

sample({
  clock: pageHooks.entered,
  fn: () => ({ page: 1, limit: 40 }),
  target: catalogQuery.start,
});

sample({
  clock: pageHooks.entered,
  fn: () => ({ page: 1, limit: 24 }),
  target: newArrivalsQuery.start,
});

sample({
  clock: pageHooks.entered,
  fn: () => ({ page: 1, limit: 40 }),
  target: fashionShowQuery.start,
});

sample({
  clock: pageHooks.entered,
  target: looksQuery.start,
});
