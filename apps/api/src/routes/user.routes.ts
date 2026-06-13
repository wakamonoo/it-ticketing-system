import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { getDepartmentUsers } from "../controllers/user.controller";

const router = Router();

router.get("/department", authMiddleware, getDepartmentUsers);

export default router;
