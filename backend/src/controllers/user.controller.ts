import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import User from "../models/User";

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId).select("-passwordHash");
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const ALLOWED_LANGUAGES = ["de", "en"];

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { address, notifications, language } = req.body;

    if (language !== undefined && !ALLOWED_LANGUAGES.includes(language)) {
      res.status(400).json({ error: `language must be one of: ${ALLOWED_LANGUAGES.join(", ")}` });
      return;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: { address, notifications, language } },
      { new: true, runValidators: true },
    ).select("-passwordHash");

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};