import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { getTicketTypes } from "../controllers/ticketType.controller";

const router = Router();

router.get("/", authMiddleware, getTicketTypes);

export default router;
