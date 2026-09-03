import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AdminUser } from "../models/AdminUser.js";
import { isTokenBlacklisted } from "../controllers/authController.js";

export async function protect(req, res, next) {
  const header = req.headers.authorization || "";
  const tokenFromHeader = header.startsWith("Bearer ") ? header.slice(7) : null;
  const tokenFromCookie = req.cookies?.studio_token;
  const token = tokenFromHeader || tokenFromCookie;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);

    if (payload.jti && isTokenBlacklisted(payload.jti)) {
      return res.status(401).json({ message: "Token has been revoked" });
    }

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
