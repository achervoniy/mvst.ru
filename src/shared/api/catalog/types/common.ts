export type CatalogProductsParams = {
  section?: number | string;
  category?: number | string; // category id
  selection?: string; // sel slug
  brand?: string | number;
  sort?: string;
  limit?: number;
  page?: number;
} & { q?: string; id?: string; gender?: string };

export type CategoryInfoResponse = {
  id: number;
  parent_id?: number;
  title: string;
  slug: string;
  description: string;
  size_dimension: number;
  is_mercury: number;
  is_mercury_watch: number;
  show_size_filter: number;
  is_custom: number;
  quantity_selector_available: number;
  root_id: number;
  root_title: string;
};

export type SelectionInfoResponse = {
  back_url: Nullable<string>;
  detail_photo?: string;
  id: number;
  preview_photo?: string;
  slug: string;
  title: string;
  url?: string;
};

export type CatalogPhoto = {
  small: string;
  middle: string;
  tiny: string;
};

export type ColorConcrete = {
  id: number;
  content_id?: string;
  title: string;
  slug: string;
  hex?: string;
  feminine?: string;
  neutral?: string;
  plural?: string;
  parental?: string;
  image_url?: Nullable<string>;
};

export interface Base {
  original: number;
  discounted: number;
  currency: string;
}

export type Displayed = {
  original: number;
  discounted: number;
  currency: string;
};

export type InternationalPrice = {
  base: Base;
  displayed: Displayed;
};

export type CatalogSize = {
  id: number;
  title: string;
  title_vnd: string;
  visible: number;
  is_visible_in_catalog: number;
};

export type SkuItem = {
  id: number;
  item_id: number;
  ext_id: number;
  ext_guid: string;
  barcode: string;
  barcode_vnd: string;
  season: string;
  size_id: number;
  size_vendor_name: string;
  price_original: number;
  price_discount: number;
  internationalPrice: InternationalPrice;
  isLast: boolean;
  visible: number;
  is_buyable: number;
  availabilityInStock: boolean;
  size: CatalogSize;
  sizeAttributes: {
    russianLabel: string;
    russianSize: string;
    vendorLabel: string;
    vendorSize: string;
  };
};

export type CatalogTag = {
  id: number;
  title: string;
  slug: string;
  color_hex?: string;
  sort?: number;
  xml_id?: number;
  only_card_payment?: number;
  show_in_filter?: number;
  visible?: number;
  season_discount?: number;
  apply_season_discount?: number;
  is_seasonable?: number;
  item_id?: string;
};

export type CatalogSelection = {
  id: number;
  visible: number;
  title: string;
  slug: string;
  preview_photo_id?: Nullable<number>;
  detail_photo_id?: Nullable<number>;
  url: Nullable<string>;
  back_url?: Nullable<string>;
  item_id: string;
};

export type CatalogProduct = {
  id: number;
  model_id: number;
  title: string;
  slug: string;
  is_buyable: boolean;
  photos: CatalogPhoto[];
  color_code: string;
  colorConcrete: ColorConcrete;
  skuList: SkuItem[];
  tags: CatalogTag[];
  selections: CatalogSelection[];
  description_lit: string;
  description_seo: Nullable<string>;
  image_alt: Nullable<string>;
  image_title: Nullable<string>;
  ext_id: string;
  gender: string;
  season: string;
  brand_id: number;
  brand_name: string;
  brandIosLogoUrl: string;
  brandListLogoUrl: string;
  brandLogoUrl: string;
  category_id: number;
  category_slug: string;
  in_wishlist: boolean;
  has_size_table: boolean;
  looks_availability_in_stock: boolean;
  isLimited: boolean;
  isMercury: boolean;
};

export type CatalogProductTransformed = CatalogProduct & {
  skuIdsAsArray: (string | number)[];
  inStock: boolean;
  isPrepay: boolean;
  isSpecialOffer: boolean;
  isPreorder: boolean;
  isAlternative?: boolean;
  isSizeable: boolean;
  page?: number;
};

export type FetchedCatalogResult = {
  list: CatalogProductTransformed[];
  pageCount: number;
  currentPage: number;
  perPage: number;
  total: number;
  isZeroQuery?: boolean;
};
