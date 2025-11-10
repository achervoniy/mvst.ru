import { CatalogProduct } from './common';

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