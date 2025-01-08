import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import AuthUser from "@/middleware/AuthUser";

const razorpayInstance = new Razorpay({
  key_id: "rzp_test_YNiLz4wMTURtjU",
  key_secret: "02iADMTpuOGFzwbiTO5kjVZ5",
});

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const isAuthUser = await AuthUser(req);
    if (!isAuthUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { amount, currency } = body;

    const orderOptions = {
      amount: amount * 100, // Convert to paise
      currency,
      receipt: `order_rcptid_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(orderOptions);

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
