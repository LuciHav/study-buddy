import Report from "../models/Report.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import HttpError from "../utils/HttpError.js";

export const createReport = async (req, res, next) => {
  const { postId, reason } = req.body;
  const userId = req.user.id;

  const post = await Post.findByPk(postId);
  if (!post) throw new HttpError(404, `Post with id #${postId} not found.`);

  const report = await Report.create({ postId, userId, reason });

  res.status(201).json({
    success: true,
    message: "Report submitted successfully.",
    report,
  });
};

export const getAllReports = async (req, res, next) => {
  const reports = await Report.findAll({
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "firstName", "lastName", "email"],
      },
      {
        model: Post,
        as: "post",
        attributes: ["id", "title", "description"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json({
    success: true,
    message: "Reports fetched successfully.",
    reports,
  });
};

export const updateReportStatus = async (req, res, next) => {
  const { reportId } = req.params;
  const { status } = req.body;

  const validStatuses = ["pending", "reviewed", "resolved"];
  if (!validStatuses.includes(status)) {
    throw new HttpError(400, "Invalid status value.");
  }

  const report = await Report.findByPk(reportId);
  if (!report)
    throw new HttpError(404, `Report with id #${reportId} not found.`);

  report.status = status;
  await report.save();

  res.status(200).json({
    success: true,
    message: `Report status updated to '${status}'.`,
    report,
  });
};
