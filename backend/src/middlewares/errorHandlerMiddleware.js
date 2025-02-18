import config from "../configs/keys.js";
import HttpError from "../utils/HttpError.js";

export const notFoundHandler = (req, res, next) => {
  const error = new HttpError(404, `Resource not found: ${req.originalUrl}`);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const timestamp = new Date().toISOString();

  console.error(`[${timestamp}] Error:`, {
    message: err.message || "Internal Server Error",
    method: req.method,
    url: req.originalUrl,
    statusCode,
    stack: err.stack,
  });

  const response = {
    success: false,
    message: err.message || "Something went wrong. Please try again later.",
  };

  if (config.app.environment !== "production") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
