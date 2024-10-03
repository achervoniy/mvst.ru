import { DOTS } from './Pagination';

export interface PaginationPage {
  id: string;
  page: number | typeof DOTS | null;
}