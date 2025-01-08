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

      const paymentCapture = 1;
      const amount = res.totalPrice * 100; // Amount in paise
      const currency = "INR";

      const options = {
        amount: amount,
        currency: currency,
        receipt: `receipt_${new Date().getTime()}`,
        payment_capture: paymentCapture,
      };

      const order = await razorpay.orders.create(options);

      return NextResponse.json({
        success: true,
        orderId: order.id,
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
      message: "Something went wrong! Please try again.",
    });
  }
}
