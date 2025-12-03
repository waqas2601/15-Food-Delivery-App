import { connectionStr } from "@/app/lib/db";
import { orderSchemaModel } from "@/app/lib/ordersModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

// CREATE ORDER
export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Validate required fields
    if (
      !payload.userId ||
      !payload.restaurantId ||
      !payload.items ||
      payload.items.length === 0
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    await mongoose.connect(connectionStr);

    // Create new order
    const newOrder = new orderSchemaModel({
      userId: payload.userId,
      restaurantId: payload.restaurantId,
      customerName: payload.customerName,
      customerEmail: payload.customerEmail,
      customerPhone: payload.customerPhone,
      deliveryAddress: payload.deliveryAddress,
      city: payload.city,
      items: payload.items,
      subtotal: payload.subtotal,
      deliveryFee: payload.deliveryFee,
      total: payload.total,
      paymentMethod: payload.paymentMethod || "cash-on-delivery",
      specialInstructions: payload.specialInstructions || "",
    });

    const savedOrder = await newOrder.save();

    return NextResponse.json({
      success: true,
      orderId: savedOrder._id,
      message: "Order placed successfully",
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create order" },
      { status: 500 }
    );
  }
}

// GET USER'S ORDERS
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const restaurantId = searchParams.get("restaurantId");

    await mongoose.connect(connectionStr);

    let orders;

    if (userId) {
      // Get orders for a specific user
      orders = await orderSchemaModel
        .find({ userId })
        .populate("restaurantId", "restoName city") // Populate restaurant details
        .sort({ createdAt: -1 })
        .lean();
    } else if (restaurantId) {
      // Get orders for a specific restaurant
      orders = await orderSchemaModel
        .find({ restaurantId })
        .sort({ createdAt: -1 })
        .lean();
    } else {
      return NextResponse.json(
        { success: false, message: "userId or restaurantId required" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
