import { Request, Response } from "express";
import WasteItem from "../models/WasteItem";
import { escapeRegex } from "../utils/escapeRegex";

export const searchWasteItem = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { q } = req.query;

    if (!q) {
      res.status(400).json({ error: "Query parameter q is required" });
      return;
    }

    const safePattern = escapeRegex(String(q));

    const items = await WasteItem.find({
      $or: [
        { name: { $regex: new RegExp(safePattern, "i") } },
        { aliases: { $regex: new RegExp(safePattern, "i") } },
      ],
    });

    if (items.length === 0) {
      res.status(404).json({ error: "No items found" });
      return;
    }

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};


export const getAllWasteItems = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const items = await WasteItem.find().sort({ name: 1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};