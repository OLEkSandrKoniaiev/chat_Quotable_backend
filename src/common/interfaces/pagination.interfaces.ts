export interface IPaginationOptions {
  page: number; // page number (starting from 1)
  limit: number; // number of documents per page
}

export interface IPaginatedResult<T> {
  data: T[];
  totalDocs: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
