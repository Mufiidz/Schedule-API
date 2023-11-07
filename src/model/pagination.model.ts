export class Pagination {
  total: number;
  currentPage: number;
  totalPages: number;
  nextPage: number | undefined;
  prevPage: number | undefined;

  constructor(total: number, currentPage: number, pageSize: number) {
    const totalPages = Math.ceil(total / pageSize);
    this.total = total;
    this.currentPage = currentPage;
    this.totalPages = totalPages < 1 ? 1 : totalPages;
    this.nextPage =
      this.currentPage < this.totalPages ? this.currentPage + 1 : undefined;
    this.prevPage = this.currentPage <= 1 ? undefined : this.currentPage - 1;
  }
}
