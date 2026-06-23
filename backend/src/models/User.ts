import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  address: {
    street: string;
    houseNumber: string;
    city: string;
  };
  notifications: {
    enabled: boolean;
    daysBefore: number;
  };
  language: "de" | "en";
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    address: {
      street: { type: String, default: "" },
      houseNumber: { type: String, default: "" },
      city: { type: String, default: "Erfurt" },
    },
    notifications: {
      enabled: { type: Boolean, default: true },
      daysBefore: { type: Number, default: 1 },
    },
    language: { type: String, enum: ["de", "en"], default: "de" },
  },
  { timestamps: true },
);

export default mongoose.model<IUser>("User", UserSchema);