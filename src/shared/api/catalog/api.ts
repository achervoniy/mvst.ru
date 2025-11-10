import { createBaseRequest } from '@/lib/request';

import { mapServerMetaToClient } from '../seo';

import { transformProductsBySelCatalog, transformSearchCatalogResult } from './helpers';
import {
  CatalogProductsParams,
  CategoryInfoResponse,
  FetchedCatalogResult,
  FetchFiltersParams,
  FiltersResponse,
  SearchCatalogProduct,
  SelCatalogProduct,
  SelectionInfoResponse,
} from './types';

export const fetchBrandCatalog = createBaseRequest<
  CatalogProductsParams & FetchFiltersParams,
  SearchCatalogProduct[],
  FetchedCatalogResult
>({
  method: 'POST',
  url: '/v2/catalog/search/brand',
  mapResult: (catalog, headers) => {
    return transformSearchCatalogResult({ data: catalog, headers });
  },
});

export const fetchCatalogSelProducts = createBaseRequest<
  CatalogProductsParams & FetchFiltersParams,
  SelCatalogProduct[],
  FetchedCatalogResult
>({
  url: '/v2/catalog/search/selection',
  method: 'post',
  mapResult: (catalog, headers) => {
    const searchCatalog = transformProductsBySelCatalog(catalog);

    return transformSearchCatalogResult({ data: searchCatalog, headers });
  },
});

export const fetchFiltersBrands = createBaseRequest<FetchFiltersParams, FiltersResponse>({
  method: 'GET',
  url: '/catalog/filter/brand',
});

export const fetchFiltersSelection = createBaseRequest<FetchFiltersParams, FiltersResponse>({
  method: 'GET',
  url: '/catalog/filter/selection',
});

export const fetchCategoryBySlug = createBaseRequest<{ slug: string }, CategoryInfoResponse>({
  method: 'GET',
  url: ({ slug }) => `/v2/catalog/category/${slug}`,
});

export const fetchSelectionInfo = createBaseRequest<{ selection: string }, SelectionInfoResponse>({
  url: ({ selection }) => `/catalog/selection/${selection}?expand=detail_photo,preview_photo`,
  method: 'get',
});

export const fetchSEO = createBaseRequest<{ url: string }, BaseMetaType>({
  method: 'POST',
  url: '/seo/info',
  mapResult: (result: any) => mapServerMetaToClient(result),
});
