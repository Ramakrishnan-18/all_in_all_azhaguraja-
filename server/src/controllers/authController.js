import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import { AdminUser } from "../models/AdminUser.js";

const tokenBlacklist = new Set();
const MAX_LOGIN_FAILURES = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

export function isTokenBlacklisted(jti) {
  return tokenBlacklist.has(jti);
}

function signToken(admin) {
  const jti = Date.now().toString(36) + Math.random().toString(36).slice(2);
  return {
    token: jwt.sign({ sub: admin._id.toString(), role: admin.role, jti }, env.jwtSecret, {
      expiresIn: env.jwtExpiresIn,
    }),
    jti,
  };
}

function setTokenCookie(res, token) {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("studio_token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
  });
}

function clearTokenCookie(res) {
  res.clearCookie("studio_token", { path: "/" });
}

// POST /auth/login
export async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const admin = await AdminUser.findOne({ email: email.toLowerCase() });
  const isLocked = admin?.lockUntil && admin.lockUntil.getTime() > Date.now();
  if (isLocked) {
    return res.status(429).json({ message: "Too many failed attempts. Try again after 15 minutes." });
  }

  if (!admin || !(await admin.comparePassword(password))) {
    if (admin) {
      admin.loginFailures = (admin.loginFailures || 0) + 1;
      if (admin.loginFailures >= MAX_LOGIN_FAILURES) {
        admin.lockUntil = new Date(Date.now() + LOCKOUT_MS);
        admin.loginFailures = 0;
      }
      await admin.save();
    }
    return res.status(401).json({ message: "Invalid email or password" });
  }

  if (admin.loginFailures || admin.lockUntil) {
    admin.loginFailures = 0;
    admin.lockUntil = null;
    await admin.save();
  }

  const { token } = signToken(admin);
  setTokenCookie(res, token);
  res.json({ name: admin.name, email: admin.email, role: admin.role, adminId: admin._id.toString() });
}

// POST /auth/logout
export async function logout(req, res) {
  const token = req.cookies?.studio_token;

  if (token) {
    try {
      const payload = jwt.verify(token, env.jwtSecret);
      if (payload.jti) tokenBlacklist.add(payload.jti);
    } catch {}
  }

  clearTokenCookie(res);
  res.json({ success: true });
}

// GET /auth/me
export async function me(req, res) {
  res.json(req.admin);
}

// GET /admins
export async function listAdmins(req, res) {
  const admins = await AdminUser.find().sort({ role: 1, name: 1 }).lean();
  res.json(admins);
}

// POST /admins
export async function createAdmin(req, res) {
  const { name, email, password, role = "Staff" } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters" });
  }
  if (!/[A-Z]/.test(password)) {
    return res.status(400).json({ message: "Password must contain at least one uppercase letter" });
  }
  if (!/[a-z]/.test(password)) {
    return res.status(400).json({ message: "Password must contain at least one lowercase letter" });
  }
  if (!/[0-9]/.test(password)) {
    return res.status(400).json({ message: "Password must contain at least one number" });
  }
  const exists = await AdminUser.findOne({ email: email.toLowerCase() });
  if (exists) {
    return res.status(400).json({ message: "An admin with this email already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const admin = await AdminUser.create({ name, email, passwordHash, role });
  res.status(201).json(admin);
}

// PATCH /admins/:id
export async function updateAdmin(req, res) {
  const { name, role } = req.body || {};
  const admin = await AdminUser.findById(req.params.id);
  if (!admin) return res.status(404).json({ message: "Admin not found" });

  if (admin.role === "Admin" && req.admin.role !== "Admin") {
    return res.status(403).json({ message: "Only an Admin can modify the Admin account" });
  }
  if (name !== undefined) admin.name = name;
  if (role !== undefined) admin.role = role;
  await admin.save();
  res.json(admin);
}

// PATCH /admins/:id/password
export async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Current and new password are required" });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters" });
  }
  if (!/[A-Z]/.test(newPassword)) {
    return res.status(400).json({ message: "Password must contain at least one uppercase letter" });
  }
  if (!/[a-z]/.test(newPassword)) {
    return res.status(400).json({ message: "Password must contain at least one lowercase letter" });
  }
  if (!/[0-9]/.test(newPassword)) {
    return res.status(400).json({ message: "Password must contain at least one number" });
  }

  if (req.params.id !== req.admin._id.toString() && req.admin.role !== "Admin") {
    return res.status(403).json({ message: "You can only change your own password" });
  }

  const admin = await AdminUser.findById(req.params.id);
  if (!admin) return res.status(404).json({ message: "Admin not found" });

  if (!(await admin.comparePassword(currentPassword))) {
    return res.status(400).json({ message: "Current password is incorrect" });
  }

  admin.passwordHash = await bcrypt.hash(newPassword, 10);
  await admin.save();

  // Invalidate old token
  const token = req.cookies?.studio_token;
  if (token) {
    try {
      const payload = jwt.verify(token, env.jwtSecret);
      if (payload.jti) tokenBlacklist.add(payload.jti);
    } catch {}
  }
  clearTokenCookie(res);

  res.json({ success: true });
}

// DELETE /admins/:id
export async function deleteAdmin(req, res) {
  const admin = await AdminUser.findById(req.params.id);
  if (!admin) return res.status(404).json({ message: "Admin not found" });
  if (admin.role === "Admin") {
    return res.status(400).json({ message: "An Admin account cannot be deleted" });
  }
  if (req.params.id === req.admin._id.toString()) {
    return res.status(400).json({ message: "You cannot delete your own account" });
  }
  await admin.deleteOne();
  res.json({ success: true });
}
