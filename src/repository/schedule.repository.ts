import { InternalServerError, NotFoundError } from "elysia";
import { ApiResponse } from "../base.response";
import ScheduleEntity from "../schema/schedule.schema";
import { Schedule } from "../model/schedule.model";
import { Pagination } from "../model/pagination.model";
import { DaySchedule } from "../model/day.model";

interface ScheduleRepository {
  postSchedule(schedule: Schedule): Promise<ApiResponse>;
  getSchedules(
    dayId: string,
    page: number,
    pageSize: number
  ): Promise<ApiResponse>;
  getSchedule(id: string): Promise<ApiResponse>;
  updateSchedule(id: string, schedule: Schedule): Promise<ApiResponse>;
  deleteSchedule(id: string): Promise<ApiResponse>;
  deleteAllSchedules(dayId: string | undefined): Promise<ApiResponse>;
}

class ScheduleRepositoryImpl implements ScheduleRepository {
  postSchedule(schedule: Schedule): Promise<ApiResponse> {
    return tryCatch(async () => {
      const response = await ScheduleEntity.create(schedule);
      const { _id, createdAt, day, title, description, time } = response;
      return ApiResponse.success(
        "Schedule created successfully",
        200,
        new Schedule(_id, day._id, title, description, time, createdAt)
      );
    });
  }
  getSchedules(
    dayId: string,
    page: number,
    pageSize: number
  ): Promise<ApiResponse> {
    return tryCatch(async () => {
      const total = await ScheduleEntity.countDocuments({ day: dayId });
      const response = await ScheduleEntity.find({ day: dayId })
        .populate("day")
        .sort({ time: "asc" })
        .skip((page - 1) * pageSize)
        .limit(pageSize);
      const schedules = response.map((schedule) => {
        const { _id, day, title, description, time } = schedule;
        const newDay = new DaySchedule(day._id, day.day, day.position);
        return new Schedule(_id, newDay.id, title, description, time);
      });
      return ApiResponse.paging(
        "Schedules fetched successfully",
        200,
        schedules,
        schedules.length === 0
          ? undefined
          : new Pagination(total, page, pageSize)
      );
    });
  }
  getSchedule(id: string): Promise<ApiResponse> {
    return tryCatch(async () => {
      const response = await ScheduleEntity.findById(id);
      if (response === null) {
        throw new NotFoundError("Schedule not found");
      }
      const { _id, createdAt, updatedAt, day, title, description, time } =
        response;
      return ApiResponse.success(
        "Schedule fetched successfully",
        200,
        new Schedule(
          _id,
          day._id,
          title,
          description,
          time,
          createdAt,
          updatedAt
        )
      );
    });
  }
  updateSchedule(id: string, schedule: Schedule): Promise<ApiResponse> {
    return tryCatch(async () => {
      const response = await ScheduleEntity.findByIdAndUpdate(id, schedule);
      if (response === null) {
        throw new NotFoundError("Schedule not found");
      }
      const { _id, createdAt, updatedAt, day, title, description, time } =
        response;
      return ApiResponse.success(
        "Schedule updated successfully",
        200,
        new Schedule(
          _id,
          day._id,
          title,
          description,
          time,
          createdAt,
          updatedAt
        )
      );
    });
  }
  deleteSchedule(id: string): Promise<ApiResponse> {
    return tryCatch(async () => {
      const response = await ScheduleEntity.findByIdAndDelete(id);
      if (response === null) {
        throw new NotFoundError("Schedule not found");
      }
      return ApiResponse.success(
        "Schedule deleted successfully",
        200,
        "Deleted schedule: " + response._id
      );
    });
  }
  deleteAllSchedules(dayId: string | undefined): Promise<ApiResponse> {
    return tryCatch(async () => {
      const response =
        dayId !== undefined
          ? await ScheduleEntity.deleteMany({ day: dayId })
          : await ScheduleEntity.deleteMany({});
      return ApiResponse.success(
        "All schedules deleted successfully",
        200,
        "Deleted schedules: " + response.deletedCount
      );
    });
  }
}

function tryCatch(body: () => Promise<ApiResponse>): Promise<ApiResponse> {
  try {
    return body();
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
}

export default ScheduleRepositoryImpl;
