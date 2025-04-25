import { ROLES, BOOKING_STATUS } from "../constants/index.js";
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

  // Check for completed bookings
  const currentDate = new Date();
  const updatedBookings = await Promise.all(
    bookings.map(async (booking) => {
      if (
        booking.status === BOOKING_STATUS.CONFIRMED &&
        new Date(booking.endDate) < currentDate
      ) {
        booking.status = BOOKING_STATUS.COMPLETED;
        await booking.save();
      }
      return booking;
    })
  );

  res.status(200).json({
    success: true,
    message: "Bookings fetched successfully",
    bookings: updatedBookings,
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

export const createBookingRequest = async (req, res, next) => {
  const {
    tutorId,
    hours,
    teachingType,
    location,
    startDate,
    endDate,
    remarks,
  } = req.body;
  const userId = req.user.id;

  // Check if tutor exists
  const tutor = await User.findOne({
    where: { id: tutorId, role: ROLES.TUTOR },
  });

  if (!tutor) {
    throw new HttpError(404, "Tutor not found");
  }

  // Validate teaching type and location
  if (!["online", "physical"].includes(teachingType)) {
    throw new HttpError(400, "Invalid teaching type");
  }

  if (teachingType === "physical" && !location) {
    throw new HttpError(400, "Location is required for physical teaching");
  }

  // Validate dates
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new HttpError(400, "Invalid date format");
  }

  if (end <= start) {
    throw new HttpError(400, "End date must be after start date");
  }

  if (start < new Date()) {
    throw new HttpError(400, "Start date cannot be in the past");
  }

  // Create booking request
  const booking = await Booking.create({
    userId,
    tutorId,
    hours,
    teachingType,
    location,
    startDate,
    endDate,
    remarks,
    status: BOOKING_STATUS.REQUESTED,
  });

  const bookingWithDetails = await Booking.findByPk(booking.id, {
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
  });

  res.status(201).json({
    success: true,
    message: "Booking request sent to tutor",
    booking: bookingWithDetails,
  });
};

export const updateBookingStatus = async (req, res, next) => {
  const { bookingId } = req.params;
  const { status } = req.body;
  const tutorId = req.user.id;

  // Validate status
  if (![BOOKING_STATUS.APPROVED, BOOKING_STATUS.REJECTED].includes(status)) {
    throw new HttpError(
      400,
      "Invalid status. Must be 'approved' or 'rejected'"
    );
  }

  // Find the booking
  const booking = await Booking.findByPk(bookingId, {
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "firstName", "lastName", "image"],
      },
    ],
  });

  if (!booking) {
    throw new HttpError(404, `Booking with id ${bookingId} not found`);
  }

  // Verify the tutor
  if (booking.tutorId !== tutorId && req.user.role !== ROLES.ADMIN) {
    throw new HttpError(403, "You are not authorized to update this booking");
  }

  // Check if the booking is in REQUESTED state
  if (booking.status !== BOOKING_STATUS.REQUESTED) {
    throw new HttpError(
      400,
      "Can only approve/reject booking requests in 'requested' state"
    );
  }

  // Update booking status
  booking.status = status;
  await booking.save();

  res.status(200).json({
    success: true,
    message: `Booking ${
      status === BOOKING_STATUS.APPROVED ? "approved" : "rejected"
    } successfully`,
    booking,
  });
};

// Cancel a booking
export const cancelBooking = async (req, res, next) => {
  const { bookingId } = req.params;
  const { id, role } = req.user;

  const booking = await Booking.findByPk(bookingId);

  if (!booking) {
    throw new HttpError(404, `Booking with id ${bookingId} not found`);
  }

  // Check if the user is authorized to cancel this booking
  const isAuthorized =
    booking.userId === id || booking.tutorId === id || role === ROLES.ADMIN;

  if (!isAuthorized) {
    throw new HttpError(403, "You are not authorized to cancel this booking");
  }

  // Check if the booking is in a state that can be cancelled or deleted
  if (booking.status === BOOKING_STATUS.CONFIRMED) {
    throw new HttpError(
      400,
      "Cannot cancel a confirmed booking. Please contact support for assistance."
    );
  }

  // Allow deletion of completed, rejected, or cancelled bookings
  const canDelete = [
    BOOKING_STATUS.COMPLETED,
    BOOKING_STATUS.REJECTED,
    BOOKING_STATUS.CANCELLED,
    BOOKING_STATUS.REQUESTED,
    BOOKING_STATUS.APPROVED,
    BOOKING_STATUS.PENDING,
  ].includes(booking.status);

  if (!canDelete) {
    throw new HttpError(
      400,
      "This booking cannot be deleted in its current state."
    );
  }

  // Delete the booking
  await booking.destroy();

  res.status(200).json({
    success: true,
    message: "Booking deleted successfully",
  });
};
