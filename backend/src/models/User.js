import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import sequelize from "../configs/database.js";
import keys from "../configs/keys.js";
import { ROLES } from "../constants/index.js";

const User = sequelize.define(
  "User",
  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ROLES.USER,
      validate: {
        isIn: [Object.values(ROLES)],
      },
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    image: {
      type: DataTypes.STRING,
    },
    verificationCode: {
      type: DataTypes.STRING,
    },
    verificationCodeExpire: {
      type: DataTypes.DATE,
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeSave: async (user) => {
        if (user.changed("password")) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
    },
  }
);

User.prototype.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

User.prototype.getAccessToken = function () {
  return jwt.sign(
    {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      role: this.role,
    },
    keys.jwt.secret,
    {
      expiresIn: keys.jwt.expiresIn,
    }
  );
};

export default User;
