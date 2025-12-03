import { connectionStr } from "@/app/lib/db";
import { orderSchemaModel } from "@/app/lib/ordersModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");

    if (!city) {
      return NextResponse.json(
        { success: false, message: "City is required" },
        { status: 400 }
      );
    }

    await mongoose.connect(connectionStr);

    // Find orders that are ready for pickup and don't have a delivery partner assigned
    // Case-insensitive city match
    const orders = await orderSchemaModel
      .find({
        city: { $regex: new RegExp(`^${city}`, "i") },
        status: "ready-for-pickup",
        deliveryPartnerId: null,
      })
      .populate("restaurantId", "restoName adress phone city")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get available orders error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
