import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    loginFailures: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
    role: {
      type: String,
      enum: ["Admin", "Manager", "Staff"],
      default: "Staff",
    },
  },
  { timestamps: true }
);

adminUserSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.passwordHash);
};

adminUserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.__v;
  delete obj.loginFailures;
  delete obj.lockUntil;
  return obj;
};

export const AdminUser = mongoose.model("AdminUser", adminUserSchema);
