import mongoose, { Schema, Document } from "mongoose";

// A single house number entry for a street, as known by the SWE
// waste calendar system. hnrId is the internal
// numeric ID needed to fetch the actual collection calendar later.
export interface IHouseNumber {
  hnrId: number;
  label: string; 
}

// Represents a real Erfurt street, with its SWE-internal strId and the
// full list of valid house numbers pre-fetched at seed time.
export interface IStreet extends Document {
  name: string;
  strId: number;
  houseNumbers: IHouseNumber[];
}

const houseNumberSchema = new Schema<IHouseNumber>(
  {
    hnrId: { type: Number, required: true },
    label: { type: String, required: true },
  },
  { _id: false }
);

const streetSchema = new Schema<IStreet>(
  {
    name: { type: String, required: true, index: true },
    strId: { type: Number, required: true, unique: true },
    houseNumbers: { type: [houseNumberSchema], default: [] },
  },
  { timestamps: true }
);

streetSchema.index({ name: "text" });

export default mongoose.model<IStreet>("Street", streetSchema);