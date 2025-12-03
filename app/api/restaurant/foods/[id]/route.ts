import { connectionStr } from "@/app/lib/db";
import { foodsSchema } from "@/app/lib/foodsModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: Request, { params }: Params) {
  // Fix: Await params before accessing properties
  const { id } = await params;

  let success = false;

  try {
    await mongoose.connect(connectionStr);
    const result = await foodsSchema.find({ resto_id: id });

    success = result.length > 0;

    return NextResponse.json({
      result,
      success,
      id,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch foods",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const { id } = await params;

  let success = false;
  try {
    await mongoose.connect(connectionStr);
    const result = await foodsSchema.deleteOne({ _id: id });
    success = result.deletedCount > 0;

    return NextResponse.json({
      result,
      success,
      id,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete food item",
      },
      { status: 500 }
    );
  }
}
