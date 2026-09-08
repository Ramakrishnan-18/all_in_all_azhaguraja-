import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import NodeCache from "node-cache";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import { uploadDir } from "./middlewares/upload.js";
import { sanitizeInput } from "./middlewares/sanitize.js";
import { csrfGenerate, csrfValidate } from "./middlewares/csrf.js";

import authRoutes from "./routes/auth.js";
import resourceRoutes from "./routes/resources.js";
import enquiryRoutes from "./routes/enquiries.js";
import settingRoutes from "./routes/settings.js";
import statsRoutes from "./routes/stats.js";
import uploadRoutes from "./routes/upload.js";
import videoSourceRoutes from "./routes/videoSources.js";
import mediaRoutes from "./routes/media.js";

const app = express();

// In-memory cache (5 min default TTL, check every 10 min)
export const cache = new NodeCache({ stdTTL: 300, checkperiod: 600 });

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));
app.use(compression());
app.use(
  cors({
    origin: env.corsOrigins.length ? env.corsOrigins : false,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
  })
);

// Global rate limiter: 100 requests per minute per IP
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests. Please try again later." },
});
app.use("/api", globalLimiter);

// Stricter limiter for auth endpoints: 5 per 15 min (per-IP)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip,
  message: { message: "Too many login attempts. Please try again after 15 minutes." },
});
app.use("/api/login", authLimiter);

// Password change limiter: 3 per 15 min
const passwordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many password change attempts. Please try again later." },
});

app.use(cookieParser());
app.use(sanitizeInput);
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// CSRF: generate token on GET, validate on POST/PUT/PATCH/DELETE (temporarily disabled for debugging)
// app.use(csrfGenerate);
// app.use(csrfValidate);

// Serve uploaded media statically with cache headers
app.use("/uploads", (req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
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
