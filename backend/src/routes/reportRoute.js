import express from "express";
import {
  createReport,
  getAllReports,
  updateReportStatus,
} from "../controllers/reportController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import validate from "../middlewares/validatorMiddleware.js";
import { reportSchema } from "../schemas/reportSchema.js";

const router = express.Router();

router.post("/", authenticate, validate(reportSchema), createReport);
router.get("/", authenticate, getAllReports);
router.patch("/:reportId", authenticate, updateReportStatus);

export default router;
