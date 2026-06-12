import { Router } from "express";
import { createTicket } from "../controllers/ticket.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createTicket);

export default router;
