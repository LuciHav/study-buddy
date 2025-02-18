import jwt from "jsonwebtoken";
import HttpError from "../utils/HttpError.js";
import keys from "../config/keys.js";
import User from "../models/User.js";
import catchAsync from "../utils/catchAsync.js";

const auth = (requiredRoles = []) =>
  catchAsync(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new HttpError(401, "Access denied. No token provided.");
    }

    if (!authHeader.toLowerCase().startsWith("bearer ")) {
      throw new HttpError(401, "Access denied. Invalid token format.");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new HttpError(401, "Access denied. Token is missing.");
    }

    try {
      const decoded = jwt.verify(token, keys.jwt.secret);

      const user = await User.findByPk(decoded.id);
      if (!user) {
        throw new HttpError(401, "Access denied. User not found.");
      }

      req.user = user;

      if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
        throw new HttpError(403, "Access denied. Insufficient permissions.");
      }

      next();
    } catch (error) {
      next(error);
    }
  });

export default auth;
