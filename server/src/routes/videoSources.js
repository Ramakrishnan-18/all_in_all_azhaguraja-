import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { protect, requireRole } from "../middlewares/auth.js";
import * as vs from "../controllers/videoSourceController.js";

const router = Router();

// Public — active sources (used to prefill/confirm source identity).
router.get("/video-sources", asyncHandler(vs.listActive));

// Public validate endpoint — can be called before posting a video.
router.post("/video-sources/validate", asyncHandler(vs.validateVideoUrl));

// Admin management.
router.use("/admin/video-sources", protect);
router.get("/admin/video-sources", asyncHandler(vs.listAll));
router.post("/admin/video-sources", requireRole("Admin", "Manager"), asyncHandler(vs.createSource));
router.patch("/admin/video-sources/:id", requireRole("Admin", "Manager"), asyncHandler(vs.updateSource));
router.patch("/admin/video-sources/:id/toggle", requireRole("Admin", "Manager"), asyncHandler(vs.toggleSource));
router.delete("/admin/video-sources/:id", requireRole("Admin"), asyncHandler(vs.deleteSource));

export default router;
