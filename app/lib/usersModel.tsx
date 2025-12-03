import mongoose from "mongoose";

const userModel = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

export const userSchema =
  mongoose.models.users || mongoose.model("users", userModel);
