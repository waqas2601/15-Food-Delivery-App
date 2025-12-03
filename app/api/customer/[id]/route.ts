import { connectionStr } from "@/app/lib/db";
import { foodsSchema } from "@/app/lib/foodsModel";
import { restaurantSchema } from "@/app/lib/restaurantsModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: Params) {
  const { id } = await params;

  try {
    await mongoose.connect(connectionStr);

    // Find restaurant by _id
    const details = await restaurantSchema.findById(id).lean();

    if (!details) {
      return NextResponse.json(
        { success: false, message: "Restaurant not found" },
        { status: 404 }
      );
    }

    // Find foods that belong to this restaurant
    let foodItems = [];
    try {
      foodItems = await foodsSchema
        .find({ resto_id: new mongoose.Types.ObjectId(id) })
        .lean();
    } catch {
      // Fallback if stored as string
      foodItems = await foodsSchema.find({ resto_id: id }).lean();
    }

    return NextResponse.json({
      success: true,
      details,
      foodItems,
    });
  } catch (error) {
    console.error("GET /api/customer/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
