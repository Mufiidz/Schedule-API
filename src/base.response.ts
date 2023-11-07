import { Pagination } from "./model/pagination.model";

export class ApiResponse {
  static success<T>(message: string, code: number, data: T) {
    return { code: code, message: message, data: data };
  }

  static paging<T>(message: string, code: number, data: T, paging: Pagination | undefined) {
    return { code, message: message, results: data, paging: paging };
  }

  static error<T>(message: string, code: number) {
    return { code: code, message: message };
  }
}
