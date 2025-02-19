import User from "../models/User.js";

export const getDashboardMetrics = async (req, res) => {
  const totalUsers = await User.count();
  const totalRevenue = 0;
  const totalSales = 0;

  res.status(200).json({
    totalUsers,
    totalRevenue,
    totalSales,
  });
};
