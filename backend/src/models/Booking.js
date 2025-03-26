import { DataTypes } from "sequelize";
import sequelize from "../configs/database.js";
import { BOOKING_STATUS } from "../constants/index.js";

const Booking = sequelize.define("Booking", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tutorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  hours: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 1000,
    },
  },
  totalAmount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  paymentIntentId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  status: {
    type: DataTypes.ENUM(Object.values(BOOKING_STATUS)),
    defaultValue: BOOKING_STATUS.PENDING,
  },
});

export default Booking;
