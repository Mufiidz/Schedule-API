import { DaySchedule } from "./day.model";

export class Schedule {
  id: string;
  day: string | DaySchedule;
  title: string;
  description: string | null;
  time: ScheduleTime;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(
    id?: string,
    day?: string | DaySchedule,
    title?: string,
    description?: string | null,
    time?: ScheduleTime,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.id = id ?? "";
    this.day = day ?? "";
    this.title = title ?? "";
    this.description = description ?? null;
    this.time = time ?? new ScheduleTime(0, 0, 0);
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export class ScheduleTime {
  hour: number;
  minute: number;
  second: number;

  constructor(hour: number, minute: number, second: number | undefined) {
    this.hour = hour;
    this.minute = minute;
    this.second = second ?? 0;
  }
}
