import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { createCheckoutSession } from "../controllers/stripeController.js";
import {
  getAllBooking,
  getBookingById,
  createBookingRequest,
  updateBookingStatus,
  cancelBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/request", authenticate, createBookingRequest);
router.patch("/:bookingId/status", authenticate, updateBookingStatus);
router.post("/checkout", authenticate, createCheckoutSession);
router.get("/", authenticate, getAllBooking);
router.get("/:bookingId", authenticate, getBookingById);
router.delete("/:bookingId", authenticate, cancelBooking);

export default router;
