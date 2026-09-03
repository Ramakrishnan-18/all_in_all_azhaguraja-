import { Router } from "express";
import rateLimit from "express-rate-limit";
import { asyncHandler } from "../utils/asyncHandler.js";
import { protect, requireRole } from "../middlewares/auth.js";
import * as auth from "../controllers/authController.js";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many login attempts. Please try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/login", loginLimiter, asyncHandler(auth.login));
router.post("/logout", asyncHandler(auth.logout));

router.get("/me", protect, asyncHandler(auth.me));

router.get("/admins", protect, requireRole("Admin", "Manager"), asyncHandler(auth.listAdmins));
router.post("/admins", protect, requireRole("Admin"), asyncHandler(auth.createAdmin));
router.patch("/admins/:id", protect, requireRole("Admin"), asyncHandler(auth.updateAdmin));
router.patch("/admins/:id/password", protect, asyncHandler(auth.changePassword));
router.delete("/admins/:id", protect, requireRole("Admin"), asyncHandler(auth.deleteAdmin));

export default router;
