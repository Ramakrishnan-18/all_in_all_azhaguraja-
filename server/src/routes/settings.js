import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { protect } from "../middlewares/auth.js";
import * as setting from "../controllers/settingController.js";

const router = Router();

router.get("/settings", asyncHandler(setting.getSettings));
router.patch("/admin/settings", protect, asyncHandler(setting.updateSettings));

export default router;
