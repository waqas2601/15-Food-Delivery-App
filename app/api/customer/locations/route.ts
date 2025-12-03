import { connectionStr } from "@/app/lib/db";
import { restaurantSchema } from "@/app/lib/restaurantsModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  await mongoose.connect(connectionStr);

  // Get all restaurants
  const data = await restaurantSchema.find();

  // Extract city names with proper capitalization
  const cities = data.map((item) => {
    const city = item.city;
    return city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
  });

  // Get unique cities
  const uniqueCities = [...new Set(cities)];

  return NextResponse.json({
    success: true,
    data: uniqueCities,
  });
}
