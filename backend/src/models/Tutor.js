import { DataTypes } from "sequelize";
import sequelize from "../configs/database.js";
import User from "./User.js";

const Tutor = sequelize.define(
  "Tutor",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subject: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    experience: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    hourlyRate: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

export default Tutor;
