import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import { AdminUser } from "../models/AdminUser.js";

function signToken(admin) {
  return jwt.sign({ sub: admin._id.toString(), role: admin.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

// POST /auth/login
export async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const admin = await AdminUser.findOne({ email: email.toLowerCase() });
  if (!admin || !(await admin.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = signToken(admin);
  res.json({ token, name: admin.name, role: admin.role });
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
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
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

  // An Admin account cannot be demoted or renamed by anyone else.
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
  if (newPassword.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
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
