import { ApiResponse } from "../base.response";
import { DaySchedule } from "../model/day.model";
import DayEntity from "../schema/day.schema";
import { Pagination } from "../model/pagination.model";
import { InternalServerError, NotFoundError } from "elysia";

interface DayRepository {
  postDay(daySchedule: DaySchedule): Promise<ApiResponse>;
  getDays(page: number, pageSize: number): Promise<ApiResponse>;
  getDay(id: string): Promise<ApiResponse>;
  updateDay(id: string, daySchedule: DaySchedule): Promise<ApiResponse>;
  deleteDay(id: string): Promise<ApiResponse>;
  deleteAllDays(): Promise<ApiResponse>;
}

class DayRepositoryImpl implements DayRepository {
  async updateDay(id: string, daySchedule: DaySchedule): Promise<ApiResponse> {
    try {
      const response = await DayEntity.findByIdAndUpdate(id, daySchedule);
      if (response === null) {
        throw new NotFoundError("Day not found");
      }
      const { _id, createdAt, updatedAt, day, position } = response;
      return ApiResponse.success(
        "Day updated successfully",
        200,
        new DaySchedule(_id, day, position, createdAt, updatedAt)
      );
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
  async deleteDay(id: string): Promise<ApiResponse> {
    try {
      const response = await DayEntity.findByIdAndDelete(id);
      if (response === null) {
        throw new NotFoundError("Day not found");
      }
      return ApiResponse.success(
        "Day deleted successfully",
        200,
        "Deleted day: " + response._id
      );
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
  async deleteAllDays(): Promise<ApiResponse> {
    try {
      const response = await DayEntity.deleteMany({});
      return ApiResponse.success(
        "All days deleted successfully",
        200,
        "Deleted days: " + response.deletedCount
      );
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
  async getDay(id: string): Promise<ApiResponse> {
    try {
      const response = await DayEntity.findById(id);
      if (response === null) {
        throw new NotFoundError("Day not found");
      }
      const { _id, createdAt, updatedAt, day, position } = response;
      return ApiResponse.success(
        "Day fetched successfully",
        200,
        new DaySchedule(_id, day, position, createdAt, updatedAt)
      );
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
  async postDay(daySchedule: DaySchedule): Promise<ApiResponse> {
    try {
      const response = await DayEntity.create(daySchedule);
      const { _id, createdAt, day, position } = response;
      return ApiResponse.success(
        "Day created successfully",
        200,
        new DaySchedule(_id, day, position, createdAt)
      );
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }

  async getDays(page: number = 1, pageSize: number = 10): Promise<ApiResponse> {
    const skip = (page - 1) * pageSize;
    try {
      const total = await DayEntity.countDocuments();
      const response = await DayEntity.find()
        .sort({ position: "asc" })
        .skip(skip)
        .limit(pageSize);
      const days = response.map((entity) => {
        const { _id, day, position } = entity;
        return new DaySchedule(_id, day, position);
      });
      return ApiResponse.paging(
        "Days fetched successfully",
        200,
        days,
        days.length === 0 ? undefined : new Pagination(total, page, pageSize)
      );
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
}

export default DayRepositoryImpl;
