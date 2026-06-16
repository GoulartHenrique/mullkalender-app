import { Router } from "express";
import { chat, photoChat } from "../controllers/ai.controller";

const router = Router();

router.post("/chat", chat);
router.post("/photo", photoChat);

export default router;