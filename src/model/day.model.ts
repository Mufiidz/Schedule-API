export class DaySchedule {
  id: string;
  day: string;
  position: number;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(
    id?: string,
    day?: string,
    position?: number,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.id = id ?? "";
    this.day = day ?? "";
    this.position = position ?? 0;
  }
}
