import { DataTypes } from "sequelize";
import sequelize from "../configs/database.js";

const Contact = sequelize.define(
  "Contact",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "replied"),
      defaultValue: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default Contact;
