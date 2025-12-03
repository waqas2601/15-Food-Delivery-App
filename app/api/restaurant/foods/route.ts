import { connectionStr } from "@/app/lib/db";
import { foodsSchema } from "@/app/lib/foodsModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(request: any) {
  const payload = await request.json();
  let success = false;
  await mongoose.connect(connectionStr);
  const food = new foodsSchema(payload);
  const result = await food.save();
  if (result) {
    success = true;
  }
  return NextResponse.json({ result, success: true });
}
