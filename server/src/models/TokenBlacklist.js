import mongoose from "mongoose";

const tokenBlacklistSchema = new mongoose.Schema(
  {
    jti: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: false }
);

// Auto-delete expired entries (MongoDB TTL index)
tokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const TokenBlacklist = mongoose.model("TokenBlacklist", tokenBlacklistSchema);
