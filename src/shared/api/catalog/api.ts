import { createBaseRequest } from '@/lib/request';

import {
  CatalogProduct,
  CatalogProductsParams,
  CategoryInfoResponse,
  FetchedCatalogResult,
  FetchFiltersParams,
  FiltersResponse,
} from './types';

export const fetchCatalog = createBaseRequest<
  CatalogProductsParams & FetchFiltersParams,
  CatalogProduct[],
  FetchedCatalogResult
>({
  method: 'POST',
  url: '/v3/catalog/search',
  mapResult: (catalog, headers) => {
    const slice = {
      pagination: {
        pageCount: Number(headers['x-pagination-page-count']),
        currentPage: Number(headers['x-pagination-current-page']),
        perPage: Number(headers['x-pagination-per-page']),
        total: Number(headers['x-pagination-total-count']),
      },
      catalogRedirect: headers['x-catalog-location'],
      correctedSearchTerm: headers['x-search-corrected-string'],
    };

    return {
      pageCount: slice.pagination.pageCount ?? 1,
      currentPage: slice.pagination.currentPage ?? 1,
      perPage: slice.pagination.perPage ?? 60,
      total: slice.pagination.total ?? 0,
      correctedSearchTerm: slice.correctedSearchTerm,
      list: catalog,
    };
  },
});

export const fetchBrandCatalog = createBaseRequest<
  CatalogProductsParams & FetchFiltersParams,
  CatalogProduct[],
  FetchedCatalogResult
>({
  method: 'POST',
  url: '/catalog/search/brand',
  mapResult: (catalog, headers) => {
    const slice = {
      pagination: {
        pageCount: Number(headers['x-pagination-page-count']),
        currentPage: Number(headers['x-pagination-current-page']),
        perPage: Number(headers['x-pagination-per-page']),
        total: Number(headers['x-pagination-total-count']),
      },
      catalogRedirect: headers['x-catalog-location'],
      correctedSearchTerm: headers['x-search-corrected-string'],
    };

    return {
      pageCount: slice.pagination.pageCount ?? 1,
      currentPage: slice.pagination.currentPage ?? 1,
      perPage: slice.pagination.perPage ?? 60,
      total: slice.pagination.total ?? 0,
      correctedSearchTerm: slice.correctedSearchTerm,
      list: catalog,
    };
  },
});

export const fetchFiltersBrands = createBaseRequest<FetchFiltersParams, FiltersResponse>({
  method: 'GET',
  url: '/catalog/filter/brand',
});

export const fetchCategoryBySlug = createBaseRequest<{ slug: string }, CategoryInfoResponse>({
  method: 'GET',
  url: ({ slug }) => `/v2/catalog/category/${slug}`,
});
