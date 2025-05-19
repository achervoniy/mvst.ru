import { createQuery } from '@farfetched/core';
import { invoke } from '@withease/factories';
import { sample } from 'effector';

import { fetchBrandCatalog, fetchCategoryBySlug, fetchFiltersBrands, fetchSEO } from '@/shared/api/catalog';
import { declarePage } from '@/shared/pageRouting';

import { HOME_PAGE_FILTERS } from '@/constants/runtimeConfig';
import { DEFAULT_MVST_SLUGS } from '@/constants/slugs';

import { validateFiltersToRequest } from '@/features/catalog/transformers';

import { pageStatusField } from '@/lib/status';

export const pageHooks = invoke(() => declarePage({ pageName: 'Catalog' }));

export const catalogQuery = createQuery({
  handler: async ({
    slug,
    section,
    ...params
  }: {
    brand: number;
    page: number;
    color?: string;
    slug: string;
    section?: number;
  }) => {
    const category = await fetchCategoryBySlug({ data: { slug } });

    if (!category) {
      return Promise.reject(new Error('no category'));
    }

    const filtersParams = { query: { ...params, section, root_section: category.id } };
    const catalogParams = { data: { limit: 60, ...params, section: section ?? category.id } };

    const [catalog, filters, seo] = await Promise.all([
      fetchBrandCatalog(catalogParams),
      fetchFiltersBrands(filtersParams),
      fetchSEO({ data: { url: `/brand/${slug}/must-774534.html` } }),
    ]);

    return { catalog, filters, category, seo };
  },
});

sample({
  clock: pageHooks.entered,
  fn: ({ url, query, params }) => {
    const slug = params?.slug || (url?.endsWith('women') ? DEFAULT_MVST_SLUGS.women : DEFAULT_MVST_SLUGS.men);

    return {
      brand: url?.endsWith('women') ? HOME_PAGE_FILTERS.female.brand : HOME_PAGE_FILTERS.men.brand,
      page: query.page ? +query.page : 1,
      ...validateFiltersToRequest(query),
      slug,
    };
  },
  target: catalogQuery.start,
});

sample({ clock: catalogQuery.finished.failure, fn: () => 404, target: pageStatusField.change });
