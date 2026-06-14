import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { getDepartmentUsers, getMe } from "../controllers/user.controller";

const router = Router();

router.get("/me", authMiddleware, getMe)
router.get("/department", authMiddleware, getDepartmentUsers);

export default router;
