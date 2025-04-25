import express from "express";
import {
  getAllTutors,
  getTutorByUserId,
  createTutor,
  updateTutor,
  deleteTutor,
  getTutorDashboardMetrics,
} from "../controllers/tutorController.js";
import upload from "../middlewares/multerMiddleware.js";
import validate from "../middlewares/validatorMiddleware.js";
import { editTutorSchema, tutorSchema } from "../schemas/tutorSchema.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", authenticate, getTutorDashboardMetrics)
router.post("/",authenticate, upload.single("image"), validate(tutorSchema), createTutor);
router.get("/", getAllTutors);
router.get("/:id", getTutorByUserId);
router.put("/:id",authenticate, upload.single("image"), validate(editTutorSchema), updateTutor);
router.delete("/:id",authenticate, deleteTutor);

export default router;
