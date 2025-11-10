type ProductType = 'watch' | 'jewelryWatch' | 'mercury' | 'preorder' | 'tsumOnly' | 'regular';

interface CatalogSearchTag {
  id: number;
  title: string;
  slug: string;
}

interface Brand {
  id: number;
  title: string;
  slug: string;
  imageUrl: string;
}

interface Category {
  id: number;
  slug: string;
}

interface Color {
  id: number;
  title: string;
  code: string;
}

interface Image {
  tiny: string;
  small: string;
  middle: string;
  large: string;
  w100: string;
  w100x2: string;
  w200: string;
  w200x2: string;
  w270: string;
  w270x2: string;
  w320: string;
  w320x2: string;
  w500: string;
  w500x2: string;
  w600: string;
  w600x2: string;
  w1320: string;
  w1320x2: string;
}

interface Offer {
  id: number;
  extId: string;
  size: {
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
  isBuyable: boolean;
}

export interface SearchCatalogProduct {
  id: number;
  isAlternative?: boolean;
  modelId: number;
  modelExtId: string;
  codeVnd: string;
  title: string;
  slug: string;
  type: ProductType;
  brand: Brand;
  category: Category;
  color: Color;
  images: Image[];
  tags: CatalogSearchTag[];
  offers: Offer[];
  imageAlt: string;
  imageTitle: string;
  isFitting: boolean;
}

interface SelCatalogImage {
  w100: string;
  w100x2: string;
  w150: string;
  w150x2: string;
  w200: string;
  w200x2: string;
  w270: string;
  w270x2: string;
  w320: string;
  w320x2: string;
  w500: string;
  w500x2: string;
  w600: string;
  w600x2: string;
  w1320: string;
  w1320x2: string;
  w2048: string;
  w2048x2: string;
}

export interface SelCatalogProduct extends Omit<SearchCatalogProduct, 'images'> {
  images: SelCatalogImage[];
}

export interface SearchCatalogResponse {
  models: SearchCatalogProduct[];
  disclaimers: {
    alternativeResult: Nullable<string>;
    emptyResult: Nullable<string>;
  };
  zeroQueries: boolean;
  correctedString?: string;
}
