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
  teachingType: {
    type: DataTypes.ENUM("online", "physical"),
    allowNull: false,
    defaultValue: "online",
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  hours: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  totalAmount: {
    type: DataTypes.INTEGER,
  },
  paymentIntentId: {
    type: DataTypes.STRING,
    unique: true,
  },
  status: {
    type: DataTypes.ENUM(Object.values(BOOKING_STATUS)),
    defaultValue: BOOKING_STATUS.REQUESTED,
  },
});

export default Booking;
