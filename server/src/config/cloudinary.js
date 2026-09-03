import cloudinary from "cloudinary";
import { env } from "./env.js";

cloudinary.v2.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

const cloudinaryConfigured = Boolean(
  env.cloudinary.cloudName && env.cloudinary.apiKey && env.cloudinary.apiSecret
);

// Generate upload params + signature for a browser-side direct upload to Cloudinary.
// The client uploads the file directly to api.cloudinary.com using these params,
// so the large media file never passes through our Express server.
export function createUploadSignature() {
  const timestamp = Math.round(Date.now() / 1000);
  const folder = env.cloudinary.folder;
  const params = { timestamp, folder };
  const signature = cloudinary.v2.utils.api_sign_request(params, env.cloudinary.apiSecret);
  return {
    cloudName: env.cloudinary.cloudName,
    apiKey: env.cloudinary.apiKey,
    timestamp,
    folder,
    signature,
  };
}

export { cloudinary, cloudinaryConfigured };
