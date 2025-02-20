import express from "express";
import {
  getAllTutors,
  getTutorById,
  createTutor,
  updateTutor,
  deleteTutor,
} from "../controllers/tutorController.js";
import upload from "../middlewares/multerMiddleware.js";
import validate from "../middlewares/validatorMiddleware.js";
import { tutorSchema } from "../schemas/tutorSchema.js";

const router = express.Router();

router.post("/", upload.single("image"), validate(tutorSchema), createTutor);
router.get("/", getAllTutors);
router.get("/:id", getTutorById);
router.put("/:id", upload.single("image"), validate(tutorSchema), updateTutor);
router.delete("/:id", deleteTutor);

export default router;
