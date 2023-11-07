import { Document } from "mongoose";
import mongoose from "../database/db";

const { Schema, model } = mongoose;

export interface DayEntity extends Document {
  position: number;
  day: string;
  createdAt: Date;
  updatedAt: Date;
}

const daySchema = new Schema<DayEntity>(
  {
    position: {
      type: Number,
      required: true,
      min: 1,
      max: 7,
    },
    day: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model<DayEntity>("day", daySchema);
