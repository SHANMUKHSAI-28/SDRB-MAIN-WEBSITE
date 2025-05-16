import { NextResponse } from "next/server";
import { connectToDB } from "@/database";
import Coupon from "@/models/coupon";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    const {
      coupon_code,
      user_id,
      order_value,
      product_category,
      products,
    } = await req.json();

    await connectToDB();

    const coupon = await Coupon.findOne({ code: coupon_code.toUpperCase() });

    if (!coupon) {
      return NextResponse.json({
        success: false,
        message: "Invalid coupon code",
      });
    }

    // Check if coupon is active
    if (!coupon.isActive) {
      return NextResponse.json({
        success: false,
        message: "This coupon is no longer active",
      });
    }

    // Check date validity
    const now = new Date();
    if (now < coupon.startDate || now > coupon.endDate) {
      return NextResponse.json({
        success: false,
        message: "This coupon has expired or is not yet valid",
      });
    }

    // Check usage limit
    if (coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json({
        success: false,
        message: "This coupon has reached its usage limit",
      });
    }

    // Check minimum order value
    if (order_value < coupon.minOrderValue) {
      return NextResponse.json({
        success: false,
        message: `Minimum order value of ₹${coupon.minOrderValue} required`,
      });
    }

    // Check user usage limit
    const userUsageCount = coupon.usageHistory.filter(
      history => history.userId.toString() === user_id
    ).length;

    if (userUsageCount >= coupon.userUsageLimit) {
      return NextResponse.json({
        success: false,
        message: "You have reached the usage limit for this coupon",
      });
    }

    // Check product category if specified
    if (coupon.productCategories.length > 0) {
      if (!coupon.productCategories.includes(product_category)) {
        return NextResponse.json({
          success: false,
          message: "This coupon is not valid for the selected products",
        });
      }
    }

    // Check specific products if specified
    if (coupon.products.length > 0) {
      const validProducts = products.every(productId =>
        coupon.products.some(couponProduct =>
          couponProduct.toString() === productId
        )
      );

      if (!validProducts) {
        return NextResponse.json({
          success: false,
          message: "This coupon is not valid for all selected products",
        });
      }
    }

    return NextResponse.json({
      success: true,
      is_valid: true,
      coupon_code: coupon.code,
      discount_type: coupon.discountType,
      discount_value: coupon.discountValue,
      description: coupon.description,
    });
  } catch (e) {
    console.error('Error validating coupon:', e);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while validating the coupon",
      },
      { status: 500 }
    );
  }
}
