import { Sequelize } from "sequelize";
import keys from "./keys.js";

const sequelize = new Sequelize(
  keys.database.databaseName,
  keys.database.user,
  keys.database.password,
  {
    host: keys.database.host,
    dialect: "mysql",
    logging: false,
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL connection established successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the MySQL database:", error.message);
    process.exit(1);
  }
};

connectDB();

export default sequelize;
