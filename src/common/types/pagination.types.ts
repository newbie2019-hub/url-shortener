export interface Pagination {
  totalCount: number;
  page: number;
  limit: number;
  filter?: string;
}

export interface PaginationMeta {
  totalCount: number;
  currentPage: number;
  perPage: number;
  totalPages: number;
  nextPage: string | null;
  prevPage: string | null;
}
