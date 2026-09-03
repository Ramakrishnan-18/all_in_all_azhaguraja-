import api from "./api";

// Uploads a single file and returns the public URL string.
// Strategy:
//  1. If the real API is reachable, get a signed Cloudinary upload preset and
//     upload the file DIRECTLY from the browser to Cloudinary (file never passes
//     through our Express server for large media).
//  2. Otherwise (mock mode / API down), falls back to a base64 data URL so the
//     existing localStorage behaviour keeps working.

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function getPresign() {
  const { data } = await api.get("/admin/media/presign");
  return data;
}

async function uploadToCloudinary(file, presign) {
  const form = new FormData();
  form.append("file", file);
  form.append("api_key", presign.apiKey);
  form.append("timestamp", presign.timestamp);
  form.append("folder", presign.folder);
  form.append("signature", presign.signature);

  const endpoint = `https://api.cloudinary.com/v1_1/${presign.cloudName}/auto/upload`;
  const res = await fetch(endpoint, { method: "POST", body: form });
  if (!res.ok) {
    throw new Error("Cloudinary upload failed");
  }
  const data = await res.json();
  return data.secure_url || data.url;
}

export async function uploadFile(file) {
  if (!file) throw new Error("No file provided");

  // Try Cloudinary direct upload.
  try {
    const presign = await getPresign();
    return await uploadToCloudinary(file, presign);
  } catch (err) {
    // For large videos, base64 fallback would exceed DB/JSON limits — fail fast.
    if (file.size > 5 * 1024 * 1024 && file.type.startsWith("video/")) {
      throw new Error("Cloudinary not configured or upload failed. Login again and check Cloudinary keys.");
    }
    // Small images: fallback to base64 so admin can keep working offline.
    return await fileToDataUrl(file);
  }
}

export async function uploadFiles(files) {
  const urls = [];
  for (const f of files) {
    urls.push(await uploadFile(f));
  }
  return urls;
}
