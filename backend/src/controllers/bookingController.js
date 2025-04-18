import { ROLES } from "../constants/index.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import HttpError from "../utils/HttpError.js";

export const getAllBooking = async (req, res, next) => {
  const { id, role } = req.user;

  let whereClause = {};

  if (role === ROLES.USER) {
    whereClause.userId = id;
  } else if (role === ROLES.TUTOR) {
    whereClause.tutorId = id;
  }
  // If admin, keep whereClause empty to fetch all

  const bookings = await Booking.findAll({
    where: whereClause,
    include: [
      {
        model: User,
        as: "tutor",
        attributes: ["id", "firstName", "lastName", "image"],
      },
      {
        model: User,
        as: "user",
        attributes: ["id", "firstName", "lastName", "image"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json({
    success: true,
    message: "Bookings fetched successfully",
    bookings,
  });
};

export const getBookingById = async (req, res, next) => {
  const { bookingId } = req.params;

  const booking = await Booking.findByPk(bookingId, {
    include: [
      {
        model: User,
        as: "tutor",
        attributes: ["id", "firstName", "lastName", "image"],
      },
      {
        model: User,
        as: "user",
        attributes: ["id", "firstName", "lastName", "image"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  if (!booking)
    throw new HttpError(404, `Booking with id ${bookingId} not found`);

  res.status(200).json({
    success: true,
    message: "Booking fetched successfully",
    booking,
  });
};
