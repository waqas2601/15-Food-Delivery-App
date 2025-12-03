import mongoose from "mongoose";

const deliveryPartnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    vehicleType: {
      type: String,
      enum: ["bike", "car", "bicycle", "scooter"],
      required: true,
    },
    vehicleNumber: { type: String, required: true },
    licenseNumber: { type: String },
    isAvailable: { type: Boolean, default: true },
    totalDeliveries: { type: Number, default: 0 },
    rating: { type: Number, default: 5.0 },
    totalEarnings: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const deliveryPartnerSchemaModel =
  mongoose.models.delivery_partners ||
  mongoose.model("delivery_partners", deliveryPartnerSchema);
