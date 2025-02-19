import { ROLES } from "../constants/index.js";
import User from "../models/User.js";
import keys from "./keys.js";

const seedAdmin = async () => {
  const existingUser = await User.findOne({
    where: { email: keys.admin.email },
  });
  if (existingUser) return;

  const user = new User({
    firstName: keys.admin.firstName,
    lastName: keys.admin.lastName,
    email: keys.admin.email,
    password: keys.admin.password,
    role: ROLES.ADMIN,
    isVerified: true,
  });

  await user.save();
  console.log("✅ Admin user successfully created.");
};

export default seedAdmin;
