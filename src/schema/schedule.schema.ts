import { Document } from "mongoose";
import mongoose from "../database/db";
import { DayEntity } from "./day.schema";

const { Schema, model } = mongoose;

export interface ScheduleEntity extends Document {
  day: DayEntity;
  title: string;
  description: string | null;
  time: { hour: number; minute: number; second: number };
  createdAt: Date;
  updatedAt: Date;
}

const scheduleSchema = new Schema<ScheduleEntity>(
  {
    day: {
      type: Schema.Types.ObjectId,
      ref: "day",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: null,
      required: false,
    },
    time: {
      hour: {
        type: Number,
        required: true,
        min: 0,
        max: 23,
      },
      minute: {
        type: Number,
        required: true,
        min: 0,
        max: 59,
      },
      second: {
        type: Number,
        required: false,
        min: 0,
        max: 59,
        default: 0,
      },
    },
  },
  { timestamps: true }
);

export default model<ScheduleEntity>("schedule", scheduleSchema);
