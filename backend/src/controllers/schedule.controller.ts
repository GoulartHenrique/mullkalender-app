import { Request, Response } from "express";
import Schedule from "../models/Schedule";

export const getScheduleByAddress = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { street, hnr } = req.query;

    if (!street) {
      res.status(400).json({ error: "Street is required" });
      return;
    }

    const schedule = await Schedule.findOne({
      street: { $regex: new RegExp(String(street), "i") },
      ...(hnr && { houseNumber: String(hnr) }),
    });

    if (!schedule) {
      res.status(404).json({ error: "Address not found" });
      return;
    }

    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
