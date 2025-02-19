import { Router } from "express";
import { getDashboardMetrics } from "../controllers/adminController.js";

const authRouter = Router();

authRouter.get("/dashboard", getDashboardMetrics);

export default authRouter;
