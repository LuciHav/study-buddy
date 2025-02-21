import { DataTypes } from "sequelize";
import sequelize from "../configs/database.js";
import { SUBJECTS } from "../constants/index.js";

const Post = sequelize.define(
  "Post",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [Object.values(SUBJECTS)],
      },
    },
  },
  { timestamps: true }
);

export default Post;
