import { connectionStr } from "@/app/lib/db";
import { orderSchemaModel } from "@/app/lib/ordersModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { orderId, partnerId } = await request.json();

    if (!orderId || !partnerId) {
      return NextResponse.json(
        { success: false, message: "Order ID and Partner ID are required" },
        { status: 400 }
      );
    }

    await mongoose.connect(connectionStr);

    // Check if partner already has an active delivery
    const activeDelivery = await orderSchemaModel.findOne({
      deliveryPartnerId: partnerId,
      status: { $in: ["ready-for-pickup", "on-the-way"] },
    });

    if (activeDelivery) {
      return NextResponse.json(
        {
          success: false,
          message: "You already have an active delivery. Complete it first!",
        },
        { status: 400 }
      );
    }

    // Check if order is still available
    const order = await orderSchemaModel.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    if (order.deliveryPartnerId) {
      return NextResponse.json(
        {
          success: false,
          message: "This order has already been accepted by another rider",
        },
        { status: 400 }
      );
    }

    if (order.status !== "ready-for-pickup") {
      return NextResponse.json(
        { success: false, message: "This order is no longer available" },
        { status: 400 }
      );
    }

    // Calculate delivery earnings dynamically
    // Option 1: Fixed fee
    // const deliveryEarnings = 50;

    // Option 2: Percentage of order total (uncomment to use)
    const deliveryEarnings = Math.max(50, Math.floor(order.total * 0.05)); // 5% of order, minimum 50

    // Option 3: Tiered based on order value (uncomment to use)
    // const deliveryEarnings = order.total < 500 ? 50 : order.total < 1000 ? 75 : 100;

    // Update order with delivery partner and set delivery earnings
    const updatedOrder = await orderSchemaModel.findByIdAndUpdate(
      orderId,
      {
        deliveryPartnerId: partnerId,
        deliveryEarnings: deliveryEarnings,
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Order accepted successfully! Go pick it up.",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Accept order error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to accept order" },
      { status: 500 }
    );
  }
}
