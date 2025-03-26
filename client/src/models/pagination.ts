export interface Pagination {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
  }
  
  export class PaginatedResponse<T> {
    items: T[];
    metaData: Pagination;
  
    constructor(items: T[], metaData: Pagination) {
      this.items = items;
      this.metaData = metaData;
    }
  }