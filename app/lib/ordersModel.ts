import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  foodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "foods",
    required: true,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  img_path: { type: String },
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "restaurants",
      required: true,
    },
    deliveryPartnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "delivery_partners",
    },

    // Customer Details
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    city: { type: String, required: true },

    // Order Items
    items: [orderItemSchema],

    // Pricing
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    total: { type: Number, required: true },

    // Order Status
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "ready-for-pickup",
        "on-the-way",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    // Payment
    paymentMethod: {
      type: String,
      enum: ["cash-on-delivery", "card", "online"],
      default: "cash-on-delivery",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    // Delivery Partner Earnings
    deliveryEarnings: { type: Number, default: 0 },

    // Notes
    specialInstructions: { type: String },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

export const orderSchemaModel =
  mongoose.models.orders || mongoose.model("orders", orderSchema);
