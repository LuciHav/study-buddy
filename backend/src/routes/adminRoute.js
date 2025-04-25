import { Router } from "express";
import { getDashboardMetrics } from "../controllers/adminController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const authRouter = Router();

authRouter.get("/dashboard", authenticate, getDashboardMetrics);

export default authRouter;
