import { Request, Response } from "express";
import Street from "../models/street.model";
import { fetchCollectionCalendar } from "../services/swe.service";

// GET /api/streets/search?q=hans
// Fast local search against the pre-seeded Street collection. Each
// result already includes its house numbers, since those were
// pre-fetched at seed time too.
export async function searchStreets(req: Request, res: Response) {
  try {
    const query = (req.query.q as string) || "";

    if (query.trim().length < 2) {
      return res.json([]);
    }

    const streets = await Street.find({
      name: { $regex: query, $options: "i" },
    })
      .limit(10)
      .sort({ name: 1 });

    return res.json(streets);
  } catch (error) {
    console.error("Error searching streets:", error);
    return res.status(500).json({ message: "Error searching streets" });
  }
}

// GET /api/schedule/lookup?streetId=173240&houseNumberId=2641112
// Live lookup of the actual collection calendar for a street + house
// number. This is the only call that still hits the SWE API live,
// since collection dates can change and are looked up rarely per user.
export async function getScheduleLookup(req: Request, res: Response) {
  try {
    const streetId = parseInt(req.query.streetId as string, 10);
    const houseNumberId = parseInt(req.query.houseNumberId as string, 10);

    if (isNaN(streetId) || isNaN(houseNumberId)) {
      return res.status(400).json({ message: "streetId and houseNumberId are required" });
    }

    const calendar = await fetchCollectionCalendar(streetId, houseNumberId);
    return res.json(calendar);
  } catch (error) {
    console.error("Error fetching collection calendar:", error);
    return res.status(500).json({ message: "Error fetching collection calendar" });
  }
}