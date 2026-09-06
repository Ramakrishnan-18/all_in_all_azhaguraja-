import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, default: "", trim: true, lowercase: true },
    eventDate: { type: String, default: "" },
    service: { type: String, default: "" },
    package: { type: String, default: "" },
    location: { type: String, default: "" },
    message: { type: String, default: "" },
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
    },
  },
  { timestamps: true }
);

enquirySchema.index({ status: 1, createdAt: -1 });

export const Enquiry = mongoose.model("Enquiry", enquirySchema);
