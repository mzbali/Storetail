export interface MetaData {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  count: number;
}

export class PaginatedItems<T> {
  metaData: MetaData;
  items: T;
  constructor(items: T, metaData: MetaData) {
    this.metaData = metaData;
    this.items = items;
  }
}
