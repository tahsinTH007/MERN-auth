import express from "express";
import dotenv from "dotenv";
import { createClient } from "redis";

import connectDB from "./config/db.js";
import userRouter from "./routes/user.js";
import devErrorHandler from "./middlewares/ErrorHandler.js";
import sendMail from "./config/sendMail.js";

// Load environment variables from .env
dotenv.config();

// Connect to MongoDB
await connectDB();

// Redis URL
const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  console.log("Missing redis url");
  process.exit(1);
}

export const redisClient = createClient({
  url: redisUrl,
});

redisClient
  .connect()
  .then(() => {
    console.log("Connected to Redis");
  })
  .catch(console.error);

// Initialize Express app
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// API Routes
app.use("/api/v1", userRouter);

// Development Error Handler
app.use(devErrorHandler);

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${port}!`
  );
});
