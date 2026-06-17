import { Router } from "express";
import { searchStreets, getScheduleLookup } from "../controllers/sweSchedule.controller";

const router = Router();

router.get("/streets/search", searchStreets);
router.get("/schedule/lookup", getScheduleLookup);

export default router;