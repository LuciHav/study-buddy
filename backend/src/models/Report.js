import { DataTypes } from "sequelize";
import sequelize from "../configs/database.js";
import { REPORT_STATUS } from "../constants/index.js";

const Report = sequelize.define("Report", {
  reason: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [10, 255],
    },
  },
  status: {
    type: DataTypes.ENUM(Object.values(REPORT_STATUS)),
    defaultValue: REPORT_STATUS.PENDING,
  },
});

export default Report;
