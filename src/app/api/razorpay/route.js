import AuthUser from "@/middleware/AuthUser";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: "rzp_test_YNiLz4wMTURtjU",
  key_secret: "02iADMTpuOGFzwbiTO5kjVZ5",
});

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const isAuthUser = await AuthUser(req);
    if (isAuthUser) {
      const res = await req.json();
      
      // Calculate total amount
      const amount = res.reduce((total, item) => {
        return total + (item.price_data.unit_amount / 100);
      }, 0);

      const options = {
        amount: amount * 100, // Razorpay expects amount in paise
        currency: "INR",
        receipt: `order_${Date.now()}`,
      };

      const order = await razorpay.orders.create(options);

      return NextResponse.json({
        success: true,
        order,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "You are not authenticated",
      });
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json({
      status: 500,
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
}