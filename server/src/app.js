import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";
import { uploadDir } from "./middlewares/upload.js";

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
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));
app.use(
  cors({
    origin: env.corsOrigins.length ? env.corsOrigins : true,
    credentials: true,
  })
);
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ extended: true, limit: "200mb" }));

// Serve uploaded media statically (dev). Replace with CDN in production.
app.use("/uploads", (req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  next();
}, express.static(uploadDir));

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// API routes
app.use("/api", authRoutes); // /api/auth/*, /api/admins/*
app.use("/api", resourceRoutes); // /api/services, /api/admin/services, etc.
app.use("/api", enquiryRoutes); // /api/enquiries, /api/admin/enquiries
app.use("/api", settingRoutes); // /api/settings, /api/admin/settings
app.use("/api", statsRoutes); // /api/admin/stats
app.use("/api", uploadRoutes); // /api/admin/upload
app.use("/api", videoSourceRoutes); // /api/video-sources, /api/admin/video-sources
app.use("/api", mediaRoutes); // /api/admin/media/presign

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Centralized error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }
  if (err.code === 11000) {
    return res.status(400).json({ message: "Duplicate value" });
  }
  if (err.message === "Unsupported file type") {
    return res.status(400).json({ message: err.message });
  }
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Server error" });
});

export default app;
