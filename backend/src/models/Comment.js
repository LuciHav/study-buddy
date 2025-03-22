import { DataTypes } from "sequelize";
import sequelize from "../configs/database.js";

const Comment = sequelize.define(
  "Comment",
  {
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

export default Comment;
