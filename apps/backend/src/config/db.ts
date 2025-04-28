import { logger } from "../utils/logger.util";
import mongoose from "mongoose";


const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/feedback-system";

let isConnected = false;
let connectionAttempts = 0;
const MAX_RETRIES = 3;

export const connectDB = async (): Promise<void> => {
  if (isConnected) {
    logger.info("Using existing database connection");
    return;
  }

  if (connectionAttempts >= MAX_RETRIES) {
    logger.error("Max connection retries reached");
    throw new Error("Database connection failed after multiple attempts");
  }

  try {
    connectionAttempts++;
    logger.info(`Attempting database connection (attempt ${connectionAttempts})`);

    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    });

    isConnected = conn.connection.readyState === 1;
    
    if (isConnected) {
      logger.info(`MongoDB Connected: ${conn.connection.host}`);
      connectionAttempts = 0; // Reset on successful connection
    } else {
      throw new Error("Connection not established");
    }
  } catch (error) {
    logger.error(`Database connection failed: ${error}`);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
    return connectDB(); // Retry connection
  }
};

// Connection events
mongoose.connection.on("connected", () => {
  logger.info("Mongoose connected to DB");
});

mongoose.connection.on("error", (err) => {
  logger.error(`Mongoose connection error: ${err}`);
});

mongoose.connection.on("disconnected", () => {
  logger.warn("Mongoose disconnected");
  isConnected = false;
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  logger.info("Mongoose connection closed due to app termination");
  process.exit(0);
});