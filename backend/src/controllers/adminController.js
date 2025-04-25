import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Tutor from "../models/Tutor.js";
import Post from "../models/Post.js";
import { BOOKING_STATUS, ROLES } from "../constants/index.js";
import { Op } from "sequelize";

export const getDashboardMetrics = async (req, res) => {
  // Basic metrics
  const totalUsers = await User.count();
  const totalTutors = await Tutor.count();
  const totalPosts = await Post.count();

  // Get confirmed bookings
  const confirmedBookings = await Booking.findAll({
    where: { status: BOOKING_STATUS.CONFIRMED },
  });

  const totalRevenue = confirmedBookings.reduce(
    (sum, booking) => sum + (booking.totalAmount || 0),
    0
  );

  // Get new posts today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const newPostsToday = await Post.count({
    where: {
      createdAt: {
        [Op.gte]: today,
      },
    },
  });

  // Get new users this week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const newUsersThisWeek = await User.count({
    where: {
      createdAt: {
        [Op.gte]: oneWeekAgo,
      },
    },
  });

  // Get user distribution by role
  const usersByRole = await User.findAll({
    attributes: ["role", [User.sequelize.fn("COUNT", "*"), "count"]],
    group: ["role"],
  });

  // Format user distribution
  const userDistribution = usersByRole.map((entry) => ({
    name: entry.role,
    value: parseInt(entry.dataValues.count),
  }));

  // Get monthly booking trends for last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const bookingTrends = await Booking.findAll({
    attributes: [
      [
        User.sequelize.fn(
          "DATE_FORMAT",
          User.sequelize.col("createdAt"),
          "%Y-%m"
        ),
        "month",
      ],
      [User.sequelize.fn("COUNT", "*"), "count"],
      [User.sequelize.fn("SUM", User.sequelize.col("totalAmount")), "revenue"],
    ],
    where: {
      createdAt: { [Op.gte]: sixMonthsAgo },
      status: BOOKING_STATUS.CONFIRMED,
    },
    group: [
      User.sequelize.fn(
        "DATE_FORMAT",
        User.sequelize.col("createdAt"),
        "%Y-%m"
      ),
    ],
    order: [
      [
        User.sequelize.fn(
          "DATE_FORMAT",
          User.sequelize.col("createdAt"),
          "%Y-%m"
        ),
        "ASC",
      ],
    ],
  });

  // Format monthly trends
  const monthlyTrends = bookingTrends.map((entry) => ({
    month: entry.dataValues.month,
    bookings: parseInt(entry.dataValues.count),
    revenue: parseFloat(entry.dataValues.revenue || 0),
  }));

  // Get pending tutor requests
  const pendingTutorRequests = await Tutor.count({
    include: [
      {
        model: User,
        as: "user",
        where: { isVerified: false },
      },
    ],
  });

  // Get top performing tutors
  const topTutors = await User.findAll({
    attributes: [
      "id",
      "firstName",
      "lastName",
      "image",
      [
        User.sequelize.literal(
          '(SELECT COUNT(DISTINCT Bookings.id) FROM Bookings WHERE Bookings.tutorId = User.id AND Bookings.status = "confirmed")'
        ),
        "totalStudents",
      ],
      [
        User.sequelize.literal(
          '(SELECT SUM(Bookings.totalAmount) FROM Bookings WHERE Bookings.tutorId = User.id AND Bookings.status = "confirmed")'
        ),
        "totalRevenue",
      ],
    ],
    where: {
      role: ROLES.TUTOR,
    },
    include: [
      {
        model: Tutor,
        as: "tutorProfile",
        attributes: ["subject"],
      },
    ],
    order: [[User.sequelize.literal("totalRevenue"), "DESC"]],
    limit: 5,
  });

  // Format top tutors data
  const formattedTopTutors = topTutors.map((tutor) => ({
    id: tutor.id,
    firstName: tutor.firstName,
    lastName: tutor.lastName,
    image: tutor.image,
    subjects: tutor.tutorProfile?.subject || [],
    totalStudents: parseInt(tutor.dataValues.totalStudents) || 0,
    totalRevenue: parseFloat(tutor.dataValues.totalRevenue) || 0,
  }));

  res.status(200).json({
    success: true,
    metrics: {
      totalUsers,
      totalTutors,
      totalPosts,
      totalRevenue,
      pendingTutorRequests,
      newPostsToday,
      newUsersThisWeek,
      userDistribution,
      monthlyTrends,
      topTutors: formattedTopTutors,
    },
  });
};
