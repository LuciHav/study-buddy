import Tutor from "../models/Tutor.js";
import HttpError from "../utils/HttpError.js";

/**
 * Get all tutors
 */
export const getAllTutors = async (req, res) => {
  const tutors = await Tutor.findAll();
  res.json({
    success: true,
    message: "Tutors fetched successfully",
    tutors,
  });
};

/**
 * Get a single tutor by ID
 */
export const getTutorById = async (req, res) => {
  const { id } = req.params;
  const tutor = await Tutor.findByPk(id);

  if (!tutor) {
    throw new HttpError(404, "Tutor not found");
  }

  res.json({
    success: true,
    message: "Tutor fetched successfully",
    tutor,
  });
};

/**
 * Create a new tutor
 */
export const createTutor = async (req, res) => {
  const { file } = req;

  const existingTutor = await Tutor.findOne({
    where: { email: req.body.email },
  });

  if (existingTutor)
    new HttpError(409, `Tutor with ${req.body.email} already exists`);

  console.log(req.body, Number(req.body.hourlyRate))

  const tutor = await Tutor.create({
    ...req.body,
    image: file.path,
    hourlyRate: Number(req.body.hourlyRate),
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
