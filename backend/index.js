import express from "express";
import path from "path";
import "express-async-errors";
import cors from "cors";
import sequelize from "./src/configs/database.js";
import keys from "./src/configs/keys.js";
import seedAdmin from "./src/configs/seedAdmin.js";
import {
  notFoundHandler,
  errorHandler,
} from "./src/middlewares/errorHandlerMiddleware.js";

import authRoute from "./src/routes/authRoute.js";
import adminRoute from "./src/routes/adminRoute.js";
import tutorRoute from "./src/routes/tutorRoute.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/public", express.static(path.join(path.resolve(), "public")));

await sequelize
  .sync()
  .then(() => console.log("✅ Database connected and synchronized."))
  .catch((err) => console.error("❌ Database synchronization failed:", err));
  
await seedAdmin();

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/tutors", tutorRoute);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(keys.server.port, () => {
  console.log(`✅ Server is up and running on port ${keys.server.port}.`);
});
