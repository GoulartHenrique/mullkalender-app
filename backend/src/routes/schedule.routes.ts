import { Router } from "express";
import { getScheduleByAddress } from "../controllers/schedule.controller";

const router = Router();

// GET /api/schedule?street=Anger&hnr=1
router.get("/", getScheduleByAddress);

export default router;
