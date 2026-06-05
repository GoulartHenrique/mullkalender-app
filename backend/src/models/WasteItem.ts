import mongoose, { Schema, Document } from "mongoose";

export interface IWasteItem extends Document {
  name: string;
  aliases: string[];
  category:
    | "Restmüll"
    | "Biotonne"
    | "Papiertonne"
    | "Gelber Sack"
    | "Sondermüll";
  bin: string | null;
  instruction: string;
  dropOffPoints?: string[];
  icon: string;
}

const WasteItemSchema = new Schema<IWasteItem>({
  name: { type: String, required: true },
  aliases: [{ type: String }],
  category: {
    type: String,
    enum: ["Restmüll", "Biotonne", "Papiertonne", "Gelber Sack", "Sondermüll"],
    required: true,
  },
  bin: { type: String, default: null },
  instruction: { type: String, required: true },
  dropOffPoints: [{ type: String }],
  icon: { type: String, required: true },
});

export default mongoose.model<IWasteItem>("WasteItem", WasteItemSchema);
