import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import { uploadDir } from "./middlewares/upload.js";
import { sanitizeInput } from "./middlewares/sanitize.js";

import authRoutes from "./routes/auth.js";
import resourceRoutes from "./routes/resources.js";
import enquiryRoutes from "./routes/enquiries.js";
import settingRoutes from "./routes/settings.js";
import statsRoutes from "./routes/stats.js";
import uploadRoutes from "./routes/upload.js";
import videoSourceRoutes from "./routes/videoSources.js";
import mediaRoutes from "./routes/media.js";

const app = express();

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));
app.use(
  cors({
    origin: env.corsOrigins.length ? env.corsOrigins : false,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(sanitizeInput);
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// Serve uploaded media statically (dev). Replace with CDN in production.
app.use("/uploads", (req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (env.corsOrigins.length) {
    const origin = req.headers.origin;
    if (env.corsOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
  }
  next();
}, express.static(uploadDir));

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// API routes
app.use("/api", authRoutes);
app.use("/api", resourceRoutes);
app.use("/api", enquiryRoutes);
app.use("/api", settingRoutes);
app.use("/api", statsRoutes);
app.use("/api", uploadRoutes);
app.use("/api", videoSourceRoutes);
app.use("/api", mediaRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Centralized error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: "Invalid input data" });
  }
  if (err.code === 11000) {
    return res.status(400).json({ message: "Duplicate value" });
  }
  if (err.message === "Unsupported file type") {
    return res.status(400).json({ message: "Unsupported file type" });
  }
  const status = err.status || 500;
  res.status(status).json({ message: status === 500 ? "Internal server error" : err.message });
});

export default app;
