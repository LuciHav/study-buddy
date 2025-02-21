import jwt from "jsonwebtoken";
import HttpError from "../utils/HttpError.js";
import User from "../models/User.js";
import keys from "../configs/keys.js";

const authenticate = async (req, res, next) => {
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
    next();
  } catch (error) {
    next(error);
  }
};

const authorize =
  (requiredRoles = []) =>
  (req, res, next) => {
    if (requiredRoles.length > 0 && !requiredRoles.includes(req.user.role)) {
      throw new HttpError(403, "Access denied. Insufficient permissions.");
    }
    next();
  };

export { authenticate, authorize };
