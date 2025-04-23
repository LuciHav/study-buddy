import { ROLES } from "../constants/index.js";
import User from "../models/User.js";
import { deleteFile } from "../utils/helpers.js";
import HttpError from "../utils/HttpError.js";

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { body } = req.body;
  const { user, file } = req;

  const userPk = null;
  // Filter based on user role
  if (user.role === ROLES.ADMIN) userPk = id;
  else userPk = user.id;

  const existingUser = await User.findByPk(userPk);

  if (!existingUser) {
    throw new HttpError(404, `User with id #${id} not found`);
  }

  const oldImage = existingUser.image;

  // Delete the old image if a new one is uploaded
  if (file && oldImage) {
    await deleteFile(oldImage);
  }

  await existingUser.update({ ...body, image: file ? file.path : oldImage });

  res.json({
    success: true,
    message: "User updated successfully",
    user,
  });
};

export const updateUserPassword = async (req, res) => {
  const { user } = req;
  const { currentPassword, newPassword } = req.body;

  const existingUser = await User.findByPk(user.id);

  if (!(await existingUser.matchPassword(currentPassword)))
    throw new HttpError(401, "Password didn't match");

  existingUser.password = newPassword;
  await existingUser.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
};
