import { DataTypes } from "sequelize";
import sequelize from "../configs/database.js";

const Comment = sequelize.define(
  "Comment",
  {
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    }
  },
  {
    timestamps: true,
  }
);

export default Comment;
