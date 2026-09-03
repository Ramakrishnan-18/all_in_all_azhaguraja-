import mongoose from "mongoose";

const videoSourceSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      enum: ["instagram", "youtube"],
      required: true,
    },
    name: { type: String, required: true, trim: true },
    sourceUrl: { type: String, required: true, trim: true },
    // Normalized account/channel identifier (e.g. "exampleaccount" or "@examplechannel")
    sourceIdentifier: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "AdminUser", default: null },
  },
  { timestamps: true }
);

videoSourceSchema.index({ platform: 1, sourceIdentifier: 1 }, { unique: true });

videoSourceSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

export const VideoSource = mongoose.model("VideoSource", videoSourceSchema);
