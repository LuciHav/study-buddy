import { ROLES } from "../constants/index.js";
import Tutor from "../models/Tutor.js";
import User from "../models/User.js";
import HttpError from "../utils/HttpError.js";

/**
 * Get all tutors
 */
export const getAllTutors = async (req, res) => {
  const tutors = await Tutor.findAll({
    include: {
      model: User,
      as: "user",
      attributes: ["firstName", "lastName", "email", "image"], // Include necessary fields from User
    },
  });

  // Merge User attributes into Tutor objects
  const mergedTutors = tutors.map((tutor) => ({
    ...tutor.toJSON(),
    ...tutor.user.toJSON(), // Merge User attributes
  }));

  res.json({
    success: true,
    message: "Tutors fetched successfully",
    tutors: mergedTutors,
  });
};

/**
 * Get a single tutor by ID
 */
export const getTutorByUserId = async (req, res) => {
  const { id: userId } = req.params;
  const tutor = await Tutor.findOne({
    where: { userId },
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
    ...tutor.user.toJSON(), // Merge User attributes
  };

  res.json({
    success: true,
    message: "Tutor fetched successfully",
    tutor: mergedTutor,
  });
};

/**
 * Create a new tutor
 */
export const createTutor = async (req, res) => {
  const { file } = req;
  const { email, firstName, lastName, password, ...tutorDetails } = req.body;

  // Check if the user already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new HttpError(409, `User with email ${email} already exists.`);
  }

  // Create the user
  const user = await User.create({
    email,
    firstName,
    lastName,
    password,
    role: ROLES.TUTOR,
    isVerified: true,
    image: file?.path,
  });

  // Create the tutor and associate it with the user
  const tutor = await Tutor.create({
    ...tutorDetails,
    hourlyRate: Number(tutorDetails.hourlyRate),
    userId: user.id,
  });

  res.status(201).json({
    success: true,
    message: "Tutor created successfully",
    tutor,
  });
};

/**
 * Update a tutor
 */
export const updateTutor = async (req, res) => {
  const { id } = req.params;
  const tutor = await Tutor.findByPk(id);

  if (!tutor) {
    throw new HttpError(404, "Tutor not found");
  }

  await tutor.update(req.body);
  res.json({
    success: true,
    message: "Tutor updated successfully",
    tutor,
  });
};

/**
 * Delete a tutor
 */
export const deleteTutor = async (req, res) => {
  const { id } = req.params;
  const tutor = await Tutor.findByPk(id);

  if (!tutor) {
    throw new HttpError(404, "Tutor not found");
  }

  await tutor.destroy();
  res.json({
    success: true,
    message: "Tutor deleted successfully",
  });
};
