import { Router } from "express";
import {
  createTicket,
  getMyTickets,
  getDepartmentTickets,
  getTicketActivity,
  getTicketById,
  assignTicket,
  escalateTicket,
  resolveTicket,
  closeTicket,
} from "../controllers/ticket.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createTicket);

router.get("/my", authMiddleware, getMyTickets);
router.get("/department", authMiddleware, getDepartmentTickets);

router.get("/:id/activity", authMiddleware, getTicketActivity);
router.get("/:id", authMiddleware, getTicketById);

router.patch("/:id/assign", authMiddleware, assignTicket);
router.patch("/:id/escalate", authMiddleware, escalateTicket);
router.patch("/:id/resolve", authMiddleware, resolveTicket);
router.patch("/:id/close", authMiddleware, closeTicket);

export default router;
