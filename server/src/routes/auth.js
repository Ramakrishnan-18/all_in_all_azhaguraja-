import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { protect, requireRole } from "../middlewares/auth.js";
import * as auth from "../controllers/authController.js";

const router = Router();

router.post("/login", asyncHandler(auth.login));

// Only the /me and /admins routes under this router require authentication.
// Scoped with explicit paths so this router does not intercept unrelated
// /api/* routes that are mounted separately (e.g. public /reels, /photos).
router.get("/me", protect, asyncHandler(auth.me));

// Admin account management — Admin creates/manages Manager & Staff.
router.get("/admins", protect, requireRole("Admin", "Manager"), asyncHandler(auth.listAdmins));
router.post("/admins", protect, requireRole("Admin"), asyncHandler(auth.createAdmin));
router.patch("/admins/:id", protect, requireRole("Admin"), asyncHandler(auth.updateAdmin));
router.patch("/admins/:id/password", protect, asyncHandler(auth.changePassword));
router.delete("/admins/:id", protect, requireRole("Admin"), asyncHandler(auth.deleteAdmin));

export default router;
