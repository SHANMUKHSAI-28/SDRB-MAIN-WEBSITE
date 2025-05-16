import { connectToDB } from "@/database";
import Coupon from "@/models/coupon";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { updateCouponSchema } from "../validation";

export async function DELETE(req, { params }) {
  try {
    await connectToDB();

    const { id } = params;

    // Validate if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        success: false,
        message: "Invalid coupon ID format",
      });
    }

    // Check if the coupon exists and has been used
    const existingCoupon = await Coupon.findById(id);
    if (!existingCoupon) {
      return NextResponse.json({
        success: false,
        message: "Coupon not found",
      });
    }

    // Check if the coupon has been used
    if (existingCoupon.totalRedemptions > 0) {
      // Instead of deleting, we'll mark it as inactive to preserve history
      const inactiveCoupon = await Coupon.findByIdAndUpdate(id, {
        isActive: false,
        endDate: new Date(), // End the coupon immediately
      }, { new: true });

      return NextResponse.json({
        success: true,
        message: "Coupon has been used. Marked as inactive instead of deleting.",
        coupon: inactiveCoupon,
      });
    }

    // If coupon hasn't been used, we can safely delete it
    const deletedCoupon = await Coupon.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Coupon deleted successfully",
      coupon: deletedCoupon,
    });
  } catch (error) {
    console.error("Error in DELETE /api/admin/coupons/[id]:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Error deleting coupon",
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectToDB();

    const { id } = params;
    const data = await req.json();

  const { error: validationError, value: validatedData } = updateCouponSchema.validate({
      ...data,
      id
    });

    if (validationError) {
      return NextResponse.json({
        success: false,
        message: validationError.details[0].message,
      });
    }

    // Check if coupon exists
    const existingCoupon = await Coupon.findById(id);
    if (!existingCoupon) {
      return NextResponse.json({
        success: false,
        message: "Coupon not found",
      });
    }

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
    } = validatedData;

    // Check if updated code conflicts with another coupon
    if (code.toUpperCase() !== existingCoupon.code) {
      const codeExists = await Coupon.findOne({ 
        code: code.toUpperCase(),
        _id: { $ne: id }
      });
      if (codeExists) {
        return NextResponse.json({
          success: false,
          message: "Coupon code already exists",
        });
      }
    }
    
    // Calculate remaining redemptions
    const totalRedemptions = existingCoupon.totalRedemptions || 0;
    const redemptionsLeft = usageLimit - totalRedemptions;

    if (redemptionsLeft < 0) {
      return NextResponse.json({
        success: false,
        message: "Usage limit cannot be less than total redemptions already made",
      });
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id,
      {
        code: code.toUpperCase(),
        description,
        discountType,
        discountValue,
        minOrderValue,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        usageLimit,
        userUsageLimit,
        productCategories,
        isActive,
        redemptionsLeft,
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Coupon updated successfully",
      coupon: updatedCoupon,
    });  } catch (error) {
    console.error("Error in PUT /api/admin/coupons/[id]:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Error updating coupon",
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
