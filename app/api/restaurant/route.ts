import { connectionStr } from "@/app/lib/db";
import { restaurantSchema } from "@/app/lib/restaurantsModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  await mongoose.connect(connectionStr);

  const data = await restaurantSchema.find();
  //   console.log(data);
  return NextResponse.json({ result: data });
}

export async function POST(request: any) {
  try {
    const payload = await request.json();
    await mongoose.connect(connectionStr);

    let result = null;
    let success = false;

    if (payload.login) {
      // LOGIN
      result = await restaurantSchema.findOne({
        email: payload.email,
        pass: payload.pass,
      });

      if (result) success = true;
    } else {
      // SIGNUP
      const newRestaurant = new restaurantSchema(payload);
      result = await newRestaurant.save();

      if (result) success = true;
    }

    return NextResponse.json({ result, success });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ result: null, success: false });
  }
}
