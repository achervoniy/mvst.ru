export type CatalogProductsParams = {
  section?: number | string; // category id
  selection?: string; // sel slug
  brand?: string;
  sort?: string;
  limit?: number;
  page?: number;
} & { q?: string; id?: string; gender?: string };

export type ShortProduct = {
  id: number;
  title: string;
  slug: string;
  brand: {
    id: number;
    title: string;
    slug: string;
    imageUrl: string;
  };
  photo: {
    tiny: string;
    small: string;
    middle: string;
  };
  price: {
    originalPrice: number;
    priceWithDiscount: number;
    discount: number;
    currency: string;
  };
};

export type CatalogAlternativesParams = {
  section: string;
  brand: number;
  color: number;
  attribute: number;
  labels: string;
  page: number;
  pageSize: number;
  novelty: number;
  discount: number;
  c360: number;
};

export type SelectioInfoResponse = {
  back_url: string | null;
  detail_photo?: string;
  id: number;
  preview_photo?: string;
  slug: string;
  title: string;
  url?: string;
};

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

export type CatalogPhoto = {
  small: string;
  middle: string;
  tiny: string;
};

export type ColorConcrete = {
  id: number;
  content_id: string;
  title: string;
  slug: string;
  hex: string;
  feminine: string;
  neutral: string;
  plural: string;
  parental: string;
  image_url: string | null;
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
  content_id: string;
  title: string;
  slug: string;
  color_hex: string;
  sort: number;
  xml_id: number;
  only_card_payment: number;
  show_in_filter: number;
  visible: number;
  season_discount: number;
  apply_season_discount: number;
  is_seasonable: number;
  item_id: string;
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

export type FetchedCatalogResult = {
  list: CatalogProduct[];
  pageCount: number;
  currentPage: number;
  perPage: number;
  total: number;
  correctedSearchTerm?: string;
};

export type FetchFiltersParams = {
  root_section?: string | number;
  section?: string | number;
  selection?: string;
  q?: string;
  gender?: 'women' | 'men' | 'kids';
  category?: string;
  brand?: string;
  color?: string;
  attribute?: string;
  size?: string;
  availability?: string;
  discount?: number;
  page: number;
  limit: number;
};

export interface FiltersCommonItem<Value = number> {
  key: string;
  value: Value;
  count: number;
  items: FiltersCommonItem<Value>[];
  title: string;
}

export interface FiltersBrandItem extends FiltersCommonItem {
  logo: string;
  is_top: 0 | 1;
}

export type FiltersCommonItemKV<Value = number> = Omit<FiltersCommonItem<Value>, 'count' | 'items' | 'title'>;

export interface CategoryFilterCommonItem extends FiltersCommonItem {
  slug: string;
  items: CategoryFilterCommonItem[];
}

export interface CategoryFilterListCommonItem extends FiltersCommonItem {
  slug: string;
  checked: Nullable<number>;
  items: CategoryFilterListCommonItem[];
}

export interface FiltersResponse {
  brand: {
    items: FiltersBrandItem[];
    applied: FiltersCommonItem[];
  };
  category: {
    items: CategoryFilterCommonItem[];
    applied: CategoryFilterCommonItem[];
    list: CategoryFilterListCommonItem[];
  };
  additional: {
    items: FiltersCommonItem[];
    applied: FiltersCommonItem[];
  };
  tag: {
    items: FiltersCommonItem<string>[];
    applied: FiltersCommonItem<string>[];
  };
  color: {
    items: FiltersCommonItem[];
    applied: FiltersCommonItem[];
  };
  size: {
    items: FiltersCommonItem[];
    applied: FiltersCommonItem[];
  };
  attribute: {
    items: (FiltersCommonItem & { items: FiltersCommonItem[] })[];
    applied: FiltersCommonItem[];
  };
  total: FiltersCommonItemKV & { info: boolean };
  availability_in_stock: FiltersCommonItemKV & { info: boolean };
  total_full: FiltersCommonItemKV & { info: boolean };
}

export type Look = {
  fileId: string;
  filePath: string;
  products: CatalogProduct[];
};

export type LooksBlock = {
  type: 'looks';
  looks: Look[];
};

export type TextBlock = {
  type: 'text';
  text: string;
};

export type LooksResponse = {
  id: number;
  slug: string;
  title: string;
  blocks: (TextBlock | LooksBlock)[];
};

export interface SkuInfo {
  type: string;
  id: string;
  attributes: {
    id: number;
    inWishlist: boolean;
  };
}

export type BrandType = {
  id: number;
  title: string;
  slug: string;
  imageUrl?: string;
  link?: string; // формируется на фронте
};

export type Category = {
  id: number;
  title: string;
  slug: string;
};

export type Photo = {
  tiny: string;
  small: string;
  middle: string;
};

export type Video = {
  url: string;
};

export type Color = {
  id: number;
  title: string;
  imageUrl: string;
};

export type AvailableColor = {
  id: number;
  slug: string;
  color: Color;
};

export type SizeTable = {
  title: string;
  mainLabel: {
    title: string;
    isVisible: boolean;
    code: string;
  };
  sizes: {
    index: number;
    value: string;
    label: {
      title: string;
      isVisible: boolean;
      code: string;
    };
  }[];
};

export type SizePrice = {
  originalPrice: number;
  priceWithDiscount: number;
  currency: string;
};

export type SizeAdditional = {
  tags: { name: string; color: Nullable<string> }[];
};

export type Size = {
  id: number;
  contentId: string;
  sizeId: number;
  extId: string;
  vendorSizeName: string;
  attributes: {
    russianLabel: string;
    russianSize: string;
    vendorLabel: string;
    vendorSize: string;
  };
  isAvailable: boolean;
  isSoon: boolean;
  availableFrom: string;
  inWishlist: boolean;
  price: SizePrice;
  additional?: SizeAdditional;
  quantity: number;
};

export type Tag = {
  id: number;
  title: string;
  slug: string;
  sort: number;
  link?: string; // формируется на фронте
};

export type FullProduct = {
  id: number;
  modelId: number;
  modelExtId: string;
  codeVnd: string;
  title: string;
  slug: string;
  type: 'preorder' | 'regular' | 'tsumOnly' | 'mercury';
  brand: BrandType;
  category: Category;
  photos: Photo[];
  videos: Video[];
  preview360: string;
  color: Color;
  availableColors: AvailableColor[];
  description: string;
  information: string[];
  // Дисклеймер онли для ТД Цум типа
  deactivationDescription?: string;
  // Дисклеймер предзаказ
  preorderDescription?: string;
  tags: Tag[];
  sizeTable: SizeTable;
  sizes: Size[];
  regulations?: { title: string; url: string };
  isBuyable: boolean;
};

