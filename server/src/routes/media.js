import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { protect } from "../middlewares/auth.js";
import { presign } from "../controllers/mediaController.js";

const router = Router();

// Signed Cloudinary upload params (authed).
router.get("/admin/media/presign", protect, asyncHandler(presign));

export default router;
