import { connectToDB } from "@/database";
import Coupon from "@/models/coupon";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectToDB();

    const data = await req.json();

    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderValue,
      startDate,
      endDate,
      usageLimit,
      userUsageLimit,
      productCategories,
      isActive,
    } = data;

    // Validate required fields
    if (!code || !description || !discountType || !discountValue || !minOrderValue || 
        !startDate || !endDate || !usageLimit || !userUsageLimit) {
      return NextResponse.json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return NextResponse.json({
        success: false,
        message: "Coupon code already exists",
      });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue,
      minOrderValue,
      startDate,
      endDate,
      usageLimit,
      userUsageLimit,
      productCategories,
      isActive,
    });

    return NextResponse.json({
      success: true,
      message: "Coupon created successfully",
      coupon,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Error creating coupon",
    });
  }
}
