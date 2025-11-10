import { AxiosHeaders } from 'axios';
import { uniqBy } from 'es-toolkit/compat';

import {
  CatalogProduct,
  CatalogProductTransformed,
  FiltersCommonItem,
  SearchCatalogProduct,
  SelCatalogProduct,
} from './types';

const createCatalogTransformer =
  <Data, Transformed extends { id: number }>({
    mapper,
    filter,
  }: {
    mapper: (_item: Data) => Transformed;
    filter: (_item: Data) => boolean;
  }) =>
  (result: { data: Data[]; headers: AxiosHeaders }) => {
    const headers = {
      pagination: {
        pageCount: Number(result.headers['x-pagination-page-count']),
        currentPage: Number(result.headers['x-pagination-current-page']),
        perPage: Number(result.headers['x-pagination-per-page']),
        total: Number(result.headers['x-pagination-total-count']),
      },
      isZeroQuery: result.headers['x-search-zero-query'] === '1',
    };

    return {
      pageCount: headers.pagination.pageCount ?? 1,
      currentPage: headers.pagination.currentPage ?? 1,
      perPage: headers.pagination.perPage ?? 60,
      total: headers.pagination.total ?? 0,
      isZeroQuery: headers.isZeroQuery,
      list: uniqBy(
        result?.data.filter(filter).map(product => mapper(product)),
        it => it.id,
      ),
    };
  };

export const getAdditionalFilterItems = (
  additionalItems: FiltersCommonItem[] = [],
  tagItems: FiltersCommonItem[] = [],
) => {
  const availabilityItem = additionalItems.find(item => item.key === 'availability');
  const withoutAvailability = additionalItems.filter(item => item.key !== 'availability');
  const result = [...withoutAvailability, ...tagItems];

  if (availabilityItem) {
    result.push(availabilityItem);
  }

  return result;
};

export const catalogProductToTransformedCatalogProduct = (
  catalogProduct: CatalogProduct,
): CatalogProductTransformed => {
  const ids = catalogProduct.skuList.map(size => size.id);

  return {
    ...catalogProduct,
    skuIdsAsArray: ids,
    inStock: catalogProduct.skuList.some(sku => sku.availabilityInStock),
    isPrepay: catalogProduct.tags ? catalogProduct.tags.some(tag => tag.slug === 'prepay') : false,
    isSpecialOffer: catalogProduct.tags ? catalogProduct.tags.some(tag => tag.slug === 'best_prices') : false,
    isPreorder: catalogProduct.tags ? catalogProduct.tags.some(tag => tag.slug === 'preorder') : false,
    isSizeable: catalogProduct.skuList.length > 0 && catalogProduct.skuList[0].size.title !== 'NS',
  };
};

export const transformSearchCatalog = (item: SearchCatalogProduct): CatalogProductTransformed => {
  const ids = item.offers.map(size => size.id);

  return {
    id: item.id,
    tags: item.tags,
    slug: item.slug,
    isAlternative: item.isAlternative,
    brandLogoUrl: item.brand.imageUrl,
    category_id: item.category.id,
    category_slug: item.category.slug,
    color_code: item.color.code,
    image_alt: item.imageAlt,
    image_title: item.imageTitle,
    colorConcrete: {
      id: item.color.id,
      title: item.color.title,
      // TODO add color slug to API
      slug: item.color.title,
    },
    ext_id: item.modelExtId,
    title: item.title,
    model_id: item.modelId,
    photos: item.images,
    isMercury: item.type === 'mercury',
    // @ts-ignore
    skuList: item.offers.map(offer => ({
      isLast: offer.quantity === 1,
      availabilityInStock: offer.quantity > 0,
      size: offer.size,
      id: offer.id,
      ext_id: offer.extId,
      quantity: offer.quantity,
      is_buyable: offer.isBuyable,
      price_discount: offer.price.priceWithDiscount,
      price_original: offer.price.originalPrice,
      sizeAttributes: offer.size,
      internationalPrice: {
        base: {
          currency: offer.price.currency,
          discounted: offer.price.priceWithDiscount,
          original: offer.price.originalPrice,
        },
        displayed: {
          currency: offer.price.currency,
          discounted: offer.price.priceWithDiscount,
          original: offer.price.originalPrice,
        },
      },
    })),
    brand_id: item.brand.id,
    brand_name: item.brand.title,
    brandIosLogoUrl: item.brand.imageUrl,
    brandListLogoUrl: item.brand.imageUrl,
    skuIdsAsArray: ids,
    inStock: item.offers.some(sku => sku.quantity > 0),
    isPrepay: item.tags ? item.tags.some(tag => tag.slug === 'prepay') : false,
    isSpecialOffer: item.tags ? item.tags.some(tag => tag.slug === 'best_prices') : false,
    isPreorder: item.tags ? item.tags.some(tag => tag.slug === 'preorder') : false,
    isSizeable: item.offers.length > 0 && item.offers[0].size.vendorSize !== 'NS',
  };
};

// SelCatalogProduct полностью совпадает с SearchCatalogProduct
// Исключение только images
export const transformProductsBySelCatalog = (products: SelCatalogProduct[]): SearchCatalogProduct[] => {
  return products.map(product => {
    const photos = product.images.map(img => ({
      tiny: img.w200,
      small: img.w200x2,
      middle: img.w600,
      large: img.w1320,
      ...img,
    }));

    return {
      ...product,
      skuList: product.offers.map(offer => ({
        isLast: offer.quantity === 1,
        availabilityInStock: offer.quantity > 0,
        size: offer.size,
        id: offer.id,
        ext_id: offer.extId,
        quantity: offer.quantity,
        is_buyable: offer.isBuyable,
        price_discount: offer.price.priceWithDiscount,
        price_original: offer.price.originalPrice,
        sizeAttributes: offer.size,
        internationalPrice: {
          base: {
            currency: offer.price.currency,
            discounted: offer.price.priceWithDiscount,
            original: offer.price.originalPrice,
          },
          displayed: {
            currency: offer.price.currency,
            discounted: offer.price.priceWithDiscount,
            original: offer.price.originalPrice,
          },
        },
      })),
      images: photos,
    };
  });
};
export const transformCatalogResult = createCatalogTransformer<CatalogProduct, CatalogProductTransformed>({
  filter: v => v.skuList.length > 0,
  mapper: product => catalogProductToTransformedCatalogProduct(product),
});

export const transformSearchCatalogResult = createCatalogTransformer<SearchCatalogProduct, CatalogProductTransformed>({
  filter: v => v.offers.length > 0,
  mapper: product => transformSearchCatalog(product),
});
