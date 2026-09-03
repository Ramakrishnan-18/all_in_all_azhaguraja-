import { createUploadSignature, cloudinaryConfigured } from "../config/cloudinary.js";

// GET /admin/media/presign
// Returns signed upload params so the browser can upload directly to Cloudinary.
export function presign(req, res) {
  if (!cloudinaryConfigured) {
    return res.status(503).json({
      message: "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.",
    });
  }
  res.json(createUploadSignature());
}
