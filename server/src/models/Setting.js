import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    brandName: { type: String, default: "" },
    tagline: { type: String, default: "" },
    contactPhone: { type: String, default: "" },
    contactWhatsApp: { type: String, default: "" },
    contactEmail: { type: String, default: "" },
    instagramUrl: { type: String, default: "" },
    youtubeUrl: { type: String, default: "" },
    location: { type: String, default: "" },
    workingHours: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Setting = mongoose.model("Setting", settingSchema);
