import AuthUser from "@/middleware/AuthUser";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpayInstance = new Razorpay({
  key_id: "rzp_test_YNiLz4wMTURtjU", // Replace with your Razorpay key ID
  key_secret: "02iADMTpuOGFzwbiTO5kjVZ5", // Replace with your Razorpay secret key
});

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const isAuthUser = await AuthUser(req);
    if (isAuthUser) {
      const { amount, currency } = await req.json();

      const order = await razorpayInstance.orders.create({
        amount: amount * 100, // Amount in smallest currency unit (e.g., paise for INR)
        currency: currency || "INR",
        receipt: `receipt_${Date.now()}`,
      });

      return NextResponse.json({
        success: true,
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "You are not authenticated",
      });
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({
      success: false,
      message: "Something went wrong! Please try again.",
    });
  }
}
