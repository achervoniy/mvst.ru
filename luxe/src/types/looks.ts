export type Money = {
  original: number;
  discounted: number;
  currency: "RUB";
};

export type Product = {
  itemId: number;
  title: string;
  slug: string;
  brand: string;
  brandLogoUrl: string;
  image: string;
  imageSmall: string;
  price: Money;
  inStock: boolean;
  buyUrl: string;
};

export type Look = {
  id: number;
  sort: number;
  image: string;
  products: Product[];
};

export type Collection = {
  id: number;
  title: string;
  slug: string;
  description: string;
  looks: Look[];
};

export const formatPrice = (value: number): string =>
  `${value.toLocaleString("ru-RU")} ₽`;
