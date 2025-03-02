import { Op } from "sequelize";
import User from "../models/User.js";
import { generateRandomCode } from "../utils/helpers.js";
import HttpError from "../utils/HttpError.js";
import sendEmailWithTemplate from "../services/postmark.js";
import { EMAIL_TEMPLATES } from "../constants/index.js";

export const signupUser = async (req, res) => {
  const { email, firstName, ...otherDetails } = req.body;

  // Check if the user already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser)
    throw new HttpError(409, "An account with this email already exists.");

  const verificationCode = generateRandomCode();
  const verificationCodeExpire = new Date(Date.now() + 60 * 60 * 1000);

  // Send verification email
  await sendEmailWithTemplate(email, EMAIL_TEMPLATES.WELCOME, {
    firstName,
    verificationCode,
  });

  // Create new user
  await User.create({
    email,
    firstName,
    verificationCode,
    verificationCodeExpire,
    ...otherDetails,
  });

  res.status(201).json({
    success: true,
    message:
      "Signup successful! A verification code has been sent to your email.",
  });
};

export const verifyEmail = async (req, res) => {
  const { verificationCode } = req.body;

  // Find user with valid verification code
  const user = await User.findOne({
    where: {
      verificationCode,
      verificationCodeExpire: { [Op.gt]: new Date() },
    },
  });

  if (!user) {
    throw new HttpError(400, "Invalid or expired verification code.");
  }

  // Update user verification status
  user.isVerified = true;
  user.verificationCode = null;
  user.verificationCodeExpire = null;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Your email has been successfully verified. You can now log in.",
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  // Find verified user
  const user = await User.findOne({ where: { email, isVerified: true } });
  
  if (!user || !(await user.matchPassword(password))) {
    throw new HttpError(401, "Incorrect email or password.");
  }

  const token = user.getAccessToken();

  res.status(200).json({
    success: true,
    message: "Login successful!",
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token,
    },
  });
};

export const forgotPassword = async (req, res, _next) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) throw new HttpError(409, `User with email ${email} not found.`);

  const verificationCode = generateRandomCode();
  const verificationCodeExpire = new Date(Date.now() + 60 * 60 * 1000);

  // Send verification email
  await sendEmailWithTemplate(email, EMAIL_TEMPLATES.PASSWORD_RESET, {
    name: user.firstName,
    verificationCode,
  });

  user.verificationCode = verificationCode;
  user.verificationCodeExpire = verificationCodeExpire;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Reset code has been sent to your email.",
  });
};

export const resetPassword = async (req, res, _next) => {
  const { verificationCode, password } = req.body;

  const user = await User.findOne({
    where: {
      verificationCode,
      verificationCodeExpire: { [Op.gt]: new Date() },
    },
  });

  if (!user)
    throw new HttpError(409, "Verification code is invalid or expired");

  user.password = password;
  user.verificationCode = null;
  user.verificationCodeExpire = null;

  await user.save();

  res.send({
    success: true,
    message: "Password has been reset successfully.",
  });
};
