import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { getDashboardStats } from "../controllers/dashboard.controller";

const router = Router();

router.get("/stats", authMiddleware, getDashboardStats);

export default router;
