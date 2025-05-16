import { NextResponse } from "next/server";
import { connectToDB } from "@/database";
import Coupon from "@/models/coupon";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    const {
      coupon_code,
      user_id,
      order_id,
      order_value,
      product_category,
      products,
    } = await req.json();

    await connectToDB();

    // First validate the coupon
    const validationRes = await fetch('/api/coupon/validate-coupon', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        coupon_code,
        user_id,
        order_value,
        product_category,
        products,
      }),
    });

    const validationData = await validationRes.json();

    if (!validationData.success || !validationData.is_valid) {
      return NextResponse.json({
        success: false,
        is_redeemed: false,
        message: validationData.message || "Coupon validation failed",
      });
    }

    // Update the coupon usage
    const coupon = await Coupon.findOneAndUpdate(
      { code: coupon_code.toUpperCase() },
      {
        $inc: { usageCount: 1 },
        $push: {
          usageHistory: {
            userId: new mongoose.Types.ObjectId(user_id),
            orderId: new mongoose.Types.ObjectId(order_id),
          },
        },
      },
      { new: true }
    );

    if (!coupon) {
      return NextResponse.json({
        success: false,
        is_redeemed: false,
        message: "Coupon not found",
      });
    }

    return NextResponse.json({
      success: true,
      is_redeemed: true,
      message: "Coupon redeemed successfully",
    });
  } catch (e) {
    console.error('Error redeeming coupon:', e);
    return NextResponse.json(
      {
        success: false,
        is_redeemed: false,
        message: "Something went wrong while redeeming the coupon",
      },
      { status: 500 }
    );
  }
}
