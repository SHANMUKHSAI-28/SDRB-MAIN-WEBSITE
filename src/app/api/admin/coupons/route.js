import { connectToDB } from "@/database";
import Coupon from "@/models/coupon";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDB();

    const coupons = await Coupon.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      coupons,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Error getting coupons",
    });
  }
}
