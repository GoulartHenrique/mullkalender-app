import { Router } from "express";
import { searchWasteItem, getAllWasteItems } from "../controllers/wasteItem.controller";

const router = Router();

// GET /api/waste-items/all
router.get("/all", getAllWasteItems);

// GET /api/waste-items?q=batterie
router.get("/", searchWasteItem);

export default router;