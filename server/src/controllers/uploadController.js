import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// POST /admin/upload — returns the public URL of the uploaded file.
// For local dev this serves from /uploads. In production point this to
// your CDN/cloud URL returned by the storage provider.
export function uploadFile(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const url = `${baseUrl}/uploads/${req.file.filename}`;
  res.status(201).json({ url, filename: req.file.filename });
}
