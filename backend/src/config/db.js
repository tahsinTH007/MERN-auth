import mongoose from "mongoose";

/**
 * Establishes a connect to MongoDB Atlas database using mongoose.
 *
 * Uses the MONGO_URI environment variables and connect to the
 * `MERNAuthentication` database.
 *
 * @throws Will exit the process if the connection failed.
 */

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables.");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "MERNAuthentication",
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("MongoDB connection failed", error);
    process.exit(1);
  }
};

export default connectDB;
