import { Router } from "express";
import { searchWasteItem } from "../controllers/wasteItem.controller";

const router = Router();

// GET /api/waste-items?q=batterie
router.get("/", searchWasteItem);

export default router;
