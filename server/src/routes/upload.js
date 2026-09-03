import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { protect } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";
import { uploadFile } from "../controllers/uploadController.js";

const router = Router();

router.post("/admin/upload", protect, upload.single("file"), asyncHandler(uploadFile));

export default router;
