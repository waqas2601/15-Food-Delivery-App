import { connectionStr } from "@/app/lib/db";
import { orderSchemaModel } from "@/app/lib/ordersModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const partnerId = searchParams.get("partnerId");

    if (!partnerId) {
      return NextResponse.json(
        { success: false, message: "Partner ID is required" },
        { status: 400 }
      );
    }

    await mongoose.connect(connectionStr);

    // Find active deliveries for this partner (including ready-for-pickup after they accept)
    const orders = await orderSchemaModel
      .find({
        deliveryPartnerId: partnerId,
        status: { $in: ["ready-for-pickup", "on-the-way"] },
      })
      .populate("restaurantId", "restoName adress phone city")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get my deliveries error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch deliveries" },
      { status: 500 }
    );
  }
}
