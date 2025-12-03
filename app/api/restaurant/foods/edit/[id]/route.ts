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
  const { id } = await params;

  let success = false;

  try {
    await mongoose.connect(connectionStr);
    const result = await foodsSchema.findOne({ _id: id });
    if (result) {
      success = true;
    }

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

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const payload = await request.json();
  let success = false;
  try {
    await mongoose.connect(connectionStr);
    const result = await foodsSchema.findOneAndUpdate({ _id: id }, payload);
    if (result) {
      success = true;
    }

    return NextResponse.json({
      result,
      success,
      id,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update food item",
      },
      { status: 500 }
    );
  }
}
