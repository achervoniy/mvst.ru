// Типы из ответов api.tsum.ru
// Документация: см. user-uploads://catalog.md (агенту) — здесь только то,
// что реально используется в UI.

export type Gender = "women" | "men";
export type SortId = "our" | "date" | "price" | "price_desc";

export interface TsumImage {
  tiny?: string;
  small?: string;
  middle?: string;
  large?: string;
  w100?: string;
  w100x2?: string;
  w200?: string;
  w200x2?: string;
  w320?: string;
  w320x2?: string;
  w400?: string;
  w400x2?: string;
  w600?: string;
  w600x2?: string;
  w1320?: string;
  w1320x2?: string;
  w2000?: string;
  w2000x2?: string;
}

export interface TsumOffer {
  id: number;
  extId: string;
  size: {
    id: number;
    russianLabel: string;
    russianSize: string;
    vendorLabel: string;
    vendorSize: string;
  };
  price: {
    originalPrice: number;
    priceWithDiscount: number;
    currency: string;
  };
  discount: number;
  quantity: number;
  isBuyable?: boolean; // отсутствует в /v1 detail-эндпоинте
}

export interface TsumProduct {
  id: number;
  modelId: number;
  modelExtId: string;
  codeVnd: string;
  title: string;
  slug: string;
  type: string;
  brand: { id: number; title: string; slug: string; imageUrl: string };
  category: { id: number; slug: string };
  color: { id: number; title: string; code: string };
  images: TsumImage[];
  imageAlt: string;
  imageTitle: string;
  tags: string[];
  offers: TsumOffer[];
  isFitting: boolean;
  fittingType: string;
  categoryType: string;
  season: string;
}

// Filters
export interface CategoryNode {
  id: number;
  count: number;
  title: string;
  slug: string;
  items: CategoryNode[];
}
export interface ColorItem {
  id: number;
  count: number;
  title: string;
  hex: string;
  imageUrl: string;
}
export interface SizeItem {
  id: number;
  count: number;
  title: string;
}
export interface SortItem {
  id: SortId;
  title: string;
  isDefault: boolean;
}
export interface LabelItem {
  id: string | number;
  count: number;
  title: string;
}
export interface PriceBucket {
  min: number;
  max: number;
  count: number;
}
export interface AttrGroup {
  id: number;
  count: number;
  title: string;
  items: AttrGroup[];
}

export interface BrandItem {
  id: number;
  count: number;
  title: string;
  isTop: boolean;
  imageUrl: string;
}

export interface TsumFilters {
  brand: { items: BrandItem[]; applied: BrandItem[]; title: string };
  category: { items: CategoryNode[]; applied: CategoryNode[]; title: string };
  color: { items: ColorItem[]; applied: ColorItem[]; title: string };
  size: { items: SizeItem[]; applied: SizeItem[]; title: string };
  price: { items: PriceBucket[]; applied: PriceBucket[]; title: string };
  sort: { items: SortItem[]; applied: SortItem[]; title?: string };
  label: { items: LabelItem[]; applied: LabelItem[]; title: string };
  attribute: { items: AttrGroup[]; applied: AttrGroup[]; title: string };
}

export interface TsumInformationProperty {
  label: string;
  value: string;
}
export interface TsumInformationSection {
  id: string;
  title: string;
  description: string;
  properties: TsumInformationProperty[];
}
export interface TsumProductVariant {
  id: number;
  slug: string;
  title: string;
  color: { id: number; title: string; imageUrl?: string };
  images: TsumImage[];
}
export interface TsumProductDetail extends Omit<TsumProduct, "color"> {
  color: { id: number; title: string; imageUrl?: string; code?: string };
  information: TsumInformationSection[];
  video?: string | null;
  products?: TsumProductVariant[];
}
export interface CatalogProduct {
  id: number;
  modelExtId: string;
  slug: string; // полный slug для нашего URL: `${modelExtId}-${apiSlug}`
  title: string;
  categoryId: number;
  categorySlug: string;
  primaryImage: string;
  hoverImage?: string;
  largeImage: string;
  minPrice: number;
  originalPrice: number; // == minPrice если скидки нет
  discountPercent: number; // 0 если нет
  hasDiscount: boolean;
  colorTitle: string;
  raw: TsumProduct; // для деталки
}
