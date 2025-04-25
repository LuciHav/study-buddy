import sequelize from "../configs/database.js";
import { ROLES } from "../constants/index.js";
import Tutor from "../models/Tutor.js";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import HttpError from "../utils/HttpError.js";
import { filterOutOther } from "../utils/helpers.js";
import { Op } from "sequelize";

export const getAllTutors = async (req, res) => {
  const tutors = await Tutor.findAll({
    include: {
      model: User,
      as: "user",
      attributes: ["firstName", "lastName", "email", "image"],
    },
  });

  // Merge User attributes into Tutor objects
  const mergedTutors = tutors.map((tutor) => ({
    ...tutor.toJSON(),
    ...tutor.user.toJSON(),
  }));

  res.json({
    success: true,
    message: "Tutors fetched successfully",
    tutors: mergedTutors,
  });
};

export const getTutorByUserId = async (req, res) => {
  const { id } = req.params;
  const tutor = await Tutor.findOne({
    where: { id },
    include: {
      model: User,
      as: "user",
      attributes: ["firstName", "lastName", "email", "image"], // Include necessary fields from User
    },
  });

  if (!tutor) {
    throw new HttpError(404, "Tutor not found");
  }

  // Merge User attributes into the Tutor object
  const mergedTutor = {
    ...tutor.toJSON(),
    ...tutor.user.toJSON(),
  };

  res.json({
    success: true,
    message: "Tutor fetched successfully",
    tutor: mergedTutor,
  });
};

export const createTutor = async (req, res) => {
  const { file } = req;
  const {
    email,
    firstName,
    lastName,
    password,
    subject,
    experience,
    ...tutorDetails
  } = req.body;

  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new HttpError(409, `User with email ${email} already exists.`);
    }

    // Create the user
    const user = await User.create(
      {
        email,
        firstName,
        lastName,
        password,
        role: ROLES.TUTOR,
        isVerified: true,
        image: file?.path,
      },
      { transaction }
    );

    // Filter subject array
    const filteredSubjects = filterOutOther(subject);
    const filteredExperience = filterOutOther(experience);

    // Create the tutor and associate it with the user
    const tutor = await Tutor.create(
      {
        ...tutorDetails,
        hourlyRate: Number(tutorDetails.hourlyRate),
        subject: filteredSubjects,
        experience: filteredExperience,
        userId: user.id,
      },
      { transaction }
    );

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: "Tutor created successfully",
      tutor,
    });
  } catch (error) {
    await transaction.rollback();
    throw new HttpError(500, `Error creating tutor: ${error.message}`);
  }
};

export const updateTutor = async (req, res) => {
  const { id } = req.params;
  const { file } = req;

  const {
    firstName,
    lastName,
    email,
    bio,
    phone,
    address,
    subject,
    experience,
    hourlyRate,
  } = req.body;

  // Find the tutor
  const tutor = await Tutor.findByPk(id);

  if (!tutor) {
    throw new HttpError(404, "Tutor not found");
  }

  // Find the associated user
  const user = await User.findByPk(tutor.userId);

  if (!user) {
    throw new HttpError(404, "User associated with tutor not found");
  }

  const transaction = await sequelize.transaction();

  try {
    // Update user information
    const userUpdateData = {
      firstName,
      lastName,
      email,
    };

    // Only update image if a new one is provided
    if (file && file.path) {
      userUpdateData.image = file.path;
    }

    // Update user model
    await user.update(userUpdateData, { transaction });

    // Filter subject array
    const filteredSubjects = filterOutOther(subject);
    const filteredExperiences = filterOutOther(experience);

    // Update tutor model
    await tutor.update(
      {
        bio,
        phone,
        address,
        subject: filteredSubjects,
        experience: filteredExperiences,
        hourlyRate: Number(hourlyRate),
      },
      { transaction }
    );

    await transaction.commit();

    // Fetch the updated tutor with user info
    const updatedTutor = await Tutor.findByPk(id, {
      include: {
        model: User,
        as: "user",
        attributes: ["firstName", "lastName", "email", "image"],
      },
    });

    // Merge User attributes into the Tutor
    const mergedTutor = {
      ...updatedTutor.toJSON(),
      ...updatedTutor.user.toJSON(),
    };

    res.json({
      success: true,
      message: "Tutor updated successfully",
      tutor: mergedTutor,
    });
  } catch (error) {
    await transaction.rollback();
    throw new HttpError(500, `Error updating tutor: ${error.message}`);
  }
};

export const deleteTutor = async (req, res) => {
  const { id } = req.params;
  const tutor = await Tutor.findByPk(id);

  if (!tutor) {
    throw new HttpError(404, "Tutor not found");
  }

  // Get the user ID from the tutor record
  const userId = tutor.userId;

  // Find and delete associated bookings
  await Booking.destroy({
    where: { tutorId: userId },
  });

  // Delete the tutor record
  await tutor.destroy();

  // Delete the associated user account
  await User.destroy({
    where: { id: userId },
  });

  res.json({
    success: true,
    message: "Tutor and all associated bookings deleted successfully",
  });
};

export const getTutorDashboardMetrics = async (req, res) => {
  const tutorId = req.user.id;
  const today = new Date();
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const sixMonthsAgo = new Date(today);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  // Get tutor's details including subjects
  const tutor = await Tutor.findOne({
    where: { userId: tutorId },
    include: {
      model: User,
      as: "user",
      attributes: ["firstName", "lastName", "email", "image"],
    },
  });

  if (!tutor) {
    throw new HttpError(404, "Tutor not found");
  }

  // Get total students
  const totalStudents = await Booking.count({
    where: {
      tutorId,
      status: "confirmed",
    },
    distinct: true,
    col: "userId",
  });

  // Get total confirmed bookings
  const totalBookings = await Booking.count({
    where: {
      tutorId,
      status: "confirmed",
    },
  });

  // Get pending booking requests
  const pendingRequests = await Booking.count({
    where: {
      tutorId,
      status: "requested",
    },
  });

  // Get total revenue
  const totalRevenue =
    (await Booking.sum("totalAmount", {
      where: {
        tutorId,
        status: "confirmed",
      },
    })) || 0;

  // Get new bookings this week
  const newBookingsThisWeek = await Booking.count({
    where: {
      tutorId,
      createdAt: { [Op.gte]: oneWeekAgo },
    },
  });

  // Get monthly trends
  const monthlyTrends = await Booking.findAll({
    attributes: [
      [
        sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%Y-%m"),
        "month",
      ],
      [sequelize.fn("COUNT", "*"), "bookings"],
      [sequelize.fn("SUM", sequelize.col("totalAmount")), "revenue"],
    ],
    where: {
      tutorId,
      status: "confirmed",
      createdAt: { [Op.gte]: sixMonthsAgo },
    },
    group: [sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%Y-%m")],
    order: [
      [sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%Y-%m"), "ASC"],
    ],
  });

  // Get recent bookings
  const recentBookings = await Booking.findAll({
    where: { tutorId },
    include: [
      {
        model: User,
        as: "user",
        attributes: ["firstName", "lastName", "image"],
      },
    ],
    order: [["createdAt", "DESC"]],
    limit: 5,
  });

  // Format monthly trends
  const formattedTrends = monthlyTrends.map((trend) => ({
    month: trend.dataValues.month,
    bookings: parseInt(trend.dataValues.bookings || 0),
    revenue: parseFloat(trend.dataValues.revenue || 0),
  }));

  res.status(200).json({
    success: true,
    metrics: {
      profile: {
        ...tutor.user.toJSON(),
        subjects: tutor.subject,
        hourlyRate: tutor.hourlyRate,
      },
      totalStudents,
      totalBookings,
      totalRevenue,
      pendingRequests,
      newBookingsThisWeek,
      monthlyTrends: formattedTrends,
      recentBookings: recentBookings.map((booking) => ({
        id: booking.id,
        student: {
          firstName: booking.user.firstName,
          lastName: booking.user.lastName,
          image: booking.user.image,
        },
        hours: booking.hours,
        status: booking.status,
        amount: booking.totalAmount,
        createdAt: booking.createdAt,
      })),
    },
  });
};
