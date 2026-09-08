import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { protect, requireRole } from "../middlewares/auth.js";
import * as auth from "../controllers/authController.js";

const router = Router();

router.post("/login", asyncHandler(auth.login));
router.post("/logout", asyncHandler(auth.logout));

router.get("/me", protect, asyncHandler(auth.me));

router.get("/admins", protect, requireRole("Admin", "Manager"), asyncHandler(auth.listAdmins));
router.post("/admins", protect, requireRole("Admin"), asyncHandler(auth.createAdmin));
router.patch("/admins/:id", protect, requireRole("Admin"), asyncHandler(auth.updateAdmin));
router.patch("/admins/:id/password", protect, asyncHandler(auth.changePassword));
router.delete("/admins/:id", protect, requireRole("Admin"), asyncHandler(auth.deleteAdmin));

export default router;
