"use client";

import { useRouter } from "next/navigation";

export default function PaymentMethod() {
  const router = useRouter();

  function handlePaymentMethod(method) {
    if (method === "razorpay") {
      localStorage.setItem("paymentMethod", "Razorpay");
      router.push("/checkout");
    } else if (method === "cod") {
      localStorage.setItem("paymentMethod", "Cash on Delivery");
      router.push("/checkout");
    }
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-5">Select Payment Method</h1>
      <button
        onClick={() => handlePaymentMethod("razorpay")}
        className="block mb-3 p-3 bg-blue-500 text-white rounded"
      >
        Pay with Razorpay
      </button>
      <button
        onClick={() => handlePaymentMethod("cod")}
        className="block p-3 bg-green-500 text-white rounded"
      >
        Cash on Delivery
      </button>
    </div>
  );
}
