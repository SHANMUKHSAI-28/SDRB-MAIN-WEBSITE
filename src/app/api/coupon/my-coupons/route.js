import { NextResponse } from "next/server";
import { connectToDB } from "@/database";
import Coupon from "@/models/coupon";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    const { user_id } = await req.json();

    await connectToDB();

    // Get all active coupons
    const coupons = await Coupon.find({
      isActive: true,
      endDate: { $gt: new Date() },
      startDate: { $lt: new Date() },
      usageCount: { $lt: "$usageLimit" },
    });

    // Filter coupons based on user's usage
    const availableCoupons = coupons.filter(coupon => {
      const userUsageCount = coupon.usageHistory.filter(
        history => history.userId.toString() === user_id
      ).length;
      return userUsageCount < coupon.userUsageLimit;
    });

    // Transform coupon data for the frontend
    const transformedCoupons = availableCoupons.map(coupon => ({
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderValue: coupon.minOrderValue,
      endDate: coupon.endDate,
      productCategories: coupon.productCategories,
    }));

    return NextResponse.json({
      success: true,
      coupons: transformedCoupons,
    });
  } catch (e) {
    console.error('Error getting user coupons:', e);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while fetching user coupons",
      },
      { status: 500 }
    );
  }
}
