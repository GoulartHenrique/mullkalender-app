import { Request, Response } from "express";
import WasteItem from "../models/WasteItem";
import { askAI, askAIWithPhoto } from "../services/ai.service";
import { escapeRegex } from "../utils/escapeRegex";

export const chat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, language } = req.body;

    if (!message) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    // Search for relevant waste items in DB
    const safePattern = escapeRegex(message);
    const items = await WasteItem.find({
      $or: [
        { name: { $regex: new RegExp(safePattern, "i") } },
        { aliases: { $regex: new RegExp(safePattern, "i") } },
      ],
    });

    // Build context from DB results
    const context = items.length > 0
      ? items.map(item =>
          `${item.name}: ${item.instruction}. Category: ${item.category}.`
        ).join("\n")
      : "No specific item found in database.";

    const reply = await askAI(message, context, language);
    res.status(200).json({ reply });
  } catch (error) {
    console.error("AI chat error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const photoChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { image, mimeType, language } = req.body;

    if (!image) {
      res.status(400).json({ error: "Image is required" });
      return;
    }

    const reply = await askAIWithPhoto(image, mimeType ?? "image/jpeg", language);
    res.status(200).json({ reply });
  } catch (error) {
    console.error("Photo chat error:", error);
    res.status(500).json({ error: "Server error" });
  }
};