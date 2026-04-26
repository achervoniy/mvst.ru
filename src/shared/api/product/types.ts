/** Ответ GET /v1/catalog/product/:id (api.tsum.ru) */
export type V1ProductImage = {
  w200?: string;
  w400?: string;
  w2000?: string;
  w2000x2?: string;
};

export type V1ProductOffer = {
  id: number;
  productId: number;
  slug: string;
  quantity: number;
  price: {
    originalPrice: number;
    priceWithDiscount: number;
    currency: string;
  };
  discount: number;
  size?: {
    id?: number;
    russianLabel?: string;
    russianSize?: string;
    vendorLabel?: string;
    vendorSize?: string;
  };
};

export type V1SiblingProduct = {
  id: number;
  slug: string;
  title: string;
  color: { id: number; title: string; imageUrl?: string };
  images?: V1ProductImage[];
};

export type V1ProductInfoBlock = {
  id: string;
  title: string;
  description: string;
  properties?: { label: string; value: string }[];
};

export type V1SizeTableRow = {
  title: string;
  code: string;
  sizes: string[];
};

export type V1SizeTable = {
  title: string;
  description?: { title: string; code: string };
  table: V1SizeTableRow[];
};

export type V1CatalogProduct = {
  id: number;
  title: string;
  slug: string;
  isBuyable: boolean;
  brand: { id: number; title: string; slug: string; imageUrl?: string | null };
  category: { id: number; title: string; slug: string; titleLink?: string };
  color: { id: number; title: string; imageUrl?: string };
  images: V1ProductImage[];
  products: V1SiblingProduct[];
  information: V1ProductInfoBlock[];
  offers: V1ProductOffer[];
  sizeTable?: V1SizeTable;
};
