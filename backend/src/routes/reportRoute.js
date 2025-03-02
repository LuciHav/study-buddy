import express from "express";
import {
  createReport,
  getAllReports,
  updateReportStatus,
} from "../controllers/reportController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, createReport);
router.get("/", authenticate, getAllReports);
router.patch("/:reportId", authenticate, updateReportStatus);

export default router;
