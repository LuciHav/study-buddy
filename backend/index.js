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
import { app, server} from "./src/configs/socket.js"

import authRoute from "./src/routes/authRoute.js";
import adminRoute from "./src/routes/adminRoute.js";
import tutorRoute from "./src/routes/tutorRoute.js";
import postRoute from "./src/routes/postRoute.js";
import commentRoute from "./src/routes/commentRoute.js";
import reportRoute from "./src/routes/reportRoute.js";
import reactionRoute from "./src/routes/reactionRoute.js";
import bookingRoute from "./src/routes/bookingRoute.js";
import webhookRoute from "./src/routes/webhookRoute.js";
import messageRoute from "./src/routes/messageRoute.js";
import userRoute from "./src/routes/userRoute.js";

import "./src/models/index.js";

app.use("/api/v1/webhook", webhookRoute);

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
app.use("/api/v1/posts", postRoute);
app.use("/api/v1/posts/:postId/comments", commentRoute);
app.use("/api/v1/posts/:postId/reactions", reactionRoute);
app.use("/api/v1/reports", reportRoute);
app.use("/api/v1/bookings", bookingRoute);
app.use("/api/v1/messages", messageRoute);
app.use("/api/v1/users", userRoute);

app.use(notFoundHandler);
app.use(errorHandler);

server.listen(keys.server.port, () => {
  console.log(`✅ Server is up and running on port ${keys.server.port}.`);
});
