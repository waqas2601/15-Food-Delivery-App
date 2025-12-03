import { connectionStr } from "@/app/lib/db";
import { restaurantSchema } from "@/app/lib/restaurantsModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const queryParams = new URL(request.url).searchParams;
    const location = queryParams.get("location");
    const restaurant = queryParams.get("restaurant");

    console.log("Filters - Location:", location, "Restaurant:", restaurant);

    // Initialize filter object
    const filter: {
      city?: { $regex: string; $options: string };
      restoName?: { $regex: string; $options: string };
    } = {};

    if (location) {
      // Case-insensitive match for city
      filter.city = { $regex: `^${location}$`, $options: "i" };
    }

    if (restaurant) {
      // Case-insensitive partial match for restaurant name
      filter.restoName = { $regex: restaurant, $options: "i" };
    }

    await mongoose.connect(connectionStr);
    const result = await restaurantSchema.find(filter);

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch restaurants",
      },
      { status: 500 }
    );
  }
}
