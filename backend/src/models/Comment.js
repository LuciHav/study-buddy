import { DataTypes } from "sequelize";
import sequelize from "../configs/database.js";

const Comment = sequelize.define(
  "Comment",
  {
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

export default Comment;
