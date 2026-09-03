import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { protect } from "../middlewares/auth.js";
import { getStats } from "../controllers/statsController.js";

const router = Router();

router.get("/admin/stats", protect, asyncHandler(getStats));

export default router;
