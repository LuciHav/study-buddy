import { DataTypes } from "sequelize";
import sequelize from "../configs/database.js";

const Reaction = sequelize.define(
  "Reaction",
  {
    reaction: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

export default Reaction;
