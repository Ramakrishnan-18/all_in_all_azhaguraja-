import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDB() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.mongodbUri, {
    maxPoolSize: 20,
    minPoolSize: 5,
    serverSelectionTimeoutMS: 5000,
    heartbeatFrequencyMS: 10000,
  });
  console.log("MongoDB connected (pool: 5-20)");
  return mongoose.connection;
}
