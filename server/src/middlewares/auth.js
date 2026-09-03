import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AdminUser } from "../models/AdminUser.js";

// Verifies the Bearer token and attaches the admin to req.admin.
export async function protect(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const admin = await AdminUser.findById(payload.sub);
    if (!admin) {
      return res.status(401).json({ message: "Account no longer exists" });
    }
    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// Role guard — usage: requireRole("Admin"), requireRole("Manager", "Admin")
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    next();
  };
}
