import express from "express";
import "express-async-errors";
import cors from "cors";
import sequelize from "./src/configs/database.js";
import keys from "./src/configs/keys.js";
import path from "path";
import {
  notFoundHandler,
  errorHandler,
} from "./src/middlewares/errorHandlerMiddleware.js";
import authRoute from "./src/routes/authRoute.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/public", express.static(path.join(path.resolve(), "public")));

sequelize
  .sync({ alter: true })
  .then(() => console.log("✅ Database connected and synchronized."))
  .catch((err) => console.error("❌ Database synchronization failed:", err));

app.use("/api/v1/auth", authRoute);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(keys.server.port, () => {
  console.log(`✅ Server is up and running on port ${keys.server.port}.`);
});
