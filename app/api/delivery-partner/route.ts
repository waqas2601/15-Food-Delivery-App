import { connectionStr } from "@/app/lib/db";
import { deliveryPartnerSchemaModel } from "@/app/lib/deliveryPartnerModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    if (!payload.email || !payload.password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    await mongoose.connect(connectionStr);

    if (payload.login) {
      // LOGIN
      const partner = await deliveryPartnerSchemaModel.findOne({
        email: payload.email,
        password: payload.password,
      });

      if (partner) {
        const { password, ...partnerWithoutPassword } = partner.toObject();

        return NextResponse.json({
          result: partnerWithoutPassword,
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
      const existingPartner = await deliveryPartnerSchemaModel.findOne({
        email: payload.email,
      });

      if (existingPartner) {
        return NextResponse.json(
          { success: false, message: "Email already registered" },
          { status: 409 }
        );
      }

      if (
        !payload.name ||
        !payload.phone ||
        !payload.city ||
        !payload.vehicleType ||
        !payload.vehicleNumber
      ) {
        return NextResponse.json(
          { success: false, message: "All fields are required" },
          { status: 400 }
        );
      }

      const newPartner = new deliveryPartnerSchemaModel({
        name: payload.name,
        email: payload.email,
        password: payload.password,
        phone: payload.phone,
        city: payload.city,
        vehicleType: payload.vehicleType,
        vehicleNumber: payload.vehicleNumber,
        licenseNumber: payload.licenseNumber || "",
      });

      const result = await newPartner.save();
      const { password, ...partnerWithoutPassword } = result.toObject();

      return NextResponse.json({
        result: partnerWithoutPassword,
        success: true,
      });
    }
  } catch (error) {
    console.error("Delivery Partner API error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
