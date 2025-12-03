import { connectionStr } from "@/app/lib/db";
import { orderSchemaModel } from "@/app/lib/ordersModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

interface Params {
  params: Promise<{ id: string }>;
}

// GET SINGLE ORDER
export async function GET(request: Request, { params }: Params) {
  const { id } = await params;

  try {
    await mongoose.connect(connectionStr);

    const order = await orderSchemaModel.findById(id).lean();

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

// UPDATE ORDER STATUS
export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, message: "Status is required" },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "ready-for-pickup",
      "on-the-way",
      "delivered",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    await mongoose.connect(connectionStr);

    const order = await orderSchemaModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update order" },
      { status: 500 }
    );
  }
}
