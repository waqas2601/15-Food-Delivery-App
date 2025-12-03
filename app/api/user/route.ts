import { connectionStr } from "@/app/lib/db";
import { userSchema } from "@/app/lib/usersModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Validate required fields
    if (!payload.email || !payload.password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    await mongoose.connect(connectionStr);

    if (payload.login) {
      // LOGIN
      const user = await userSchema.findOne({
        email: payload.email,
        password: payload.password,
      });

      if (user) {
        // Don't send password back to client
        const { password, ...userWithoutPassword } = user.toObject();

        return NextResponse.json({
          result: userWithoutPassword,
          success: true,
        });
      } else {
        return NextResponse.json(
          { success: false, message: "Invalid email or password" },
          { status: 401 }
        );
      }
    } else {
      // SIGNUP

      // Check if user already exists
      const existingUser = await userSchema.findOne({ email: payload.email });
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: "Email already registered" },
          { status: 409 }
        );
      }

      // Validate all required fields for signup
      if (
        !payload.name ||
        !payload.city ||
        !payload.address ||
        !payload.phone
      ) {
        return NextResponse.json(
          { success: false, message: "All fields are required" },
          { status: 400 }
        );
      }

      // Create new user
      const newUser = new userSchema({
        name: payload.name,
        email: payload.email,
        password: payload.password,
        city: payload.city,
        address: payload.address,
        phone: payload.phone,
      });

      const result = await newUser.save();

      // Don't send password back to client
      const { password, ...userWithoutPassword } = result.toObject();

      return NextResponse.json({
        result: userWithoutPassword,
        success: true,
      });
    }
  } catch (error) {
    console.error("User API error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
