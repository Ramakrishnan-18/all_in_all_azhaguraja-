import { Router } from "express";
import rateLimit from "express-rate-limit";
import { asyncHandler } from "../utils/asyncHandler.js";
import { protect, requireRole } from "../middlewares/auth.js";
import * as enquiry from "../controllers/enquiryController.js";

const router = Router();

// Public
const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Too many submissions, please try again later" },
});
router.post("/enquiries", submitLimiter, asyncHandler(enquiry.submitEnquiry));

// Admin
router.use("/admin/enquiries", protect);
router.get("/admin/enquiries", asyncHandler(enquiry.listEnquiries));
router.patch("/admin/enquiries/:id/status", asyncHandler(enquiry.updateEnquiryStatus));
router.delete("/admin/enquiries/:id", asyncHandler(enquiry.deleteEnquiry));

export default router;
