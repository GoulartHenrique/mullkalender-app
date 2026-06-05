import mongoose, { Schema, Document } from "mongoose";

interface IWasteEntry {
  type: "Restmüll" | "Biotonne" | "Papiertonne" | "Gelber Sack";
  color: string;
  dates: string[];
  frequency: "weekly" | "biweekly" | "monthly";
}

export interface ISchedule extends Document {
  street: string;
  houseNumber: string;
  district: string;
  city: string;
  schedule: IWasteEntry[];
  updatedAt: Date;
}

const WasteEntrySchema = new Schema<IWasteEntry>({
  type: {
    type: String,
    enum: ["Restmüll", "Biotonne", "Papiertonne", "Gelber Sack"],
    required: true,
  },
  color: { type: String, required: true },
  dates: [{ type: String, required: true }],
  frequency: {
    type: String,
    enum: ["weekly", "biweekly", "monthly"],
    required: true,
  },
});

const ScheduleSchema = new Schema<ISchedule>(
  {
    street: { type: String, required: true },
    houseNumber: { type: String, required: true },
    district: { type: String, required: true },
    city: { type: String, required: true, default: "Erfurt" },
    schedule: [WasteEntrySchema],
  },
  { timestamps: true },
);

export default mongoose.model<ISchedule>("Schedule", ScheduleSchema);
