"use client";
import Notification from "@/components/Notification";
import { GlobalContext } from "@/context";
import { fetchAllAddresses } from "@/services/address";
import { createNewOrder } from "@/services/order";
import { callStripeSession } from "@/services/stripe";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";
import { toast } from "react-toastify";

export default function Checkout() {
  const {
    cartItems,
    user,
    addresses,
    setAddresses,
    checkoutFormData,
    setCheckoutFormData,
  } = useContext(GlobalContext);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isOrderProcessing, setIsOrderProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const router = useRouter();
  const params = useSearchParams();

  const publishableKey =
    "pk_test_51OPFRtSJA9GAEIjE6wRcmZj7YuO4g0Md53AhigtPWcLzPDQte5QeVeTZaSGlJEuV9vKMoaLjCSRg6PH1oCwcuOPR00TqPDos3Y";
  const stripePromise = loadStripe(publishableKey);

  async function getAllAddresses() {
    const res = await fetchAllAddresses(user?._id);
    if (res.success) {
      setAddresses(res.data);
    }
  }

  useEffect(() => {
    if (user !== null) getAllAddresses();
  }, [user]);

  async function loadRazorpayScript() {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  async function handleCheckout() {
    const paymentMethod = localStorage.getItem("paymentMethod");
    const totalPrice = cartItems.reduce(
      (total, item) => item.productID.price + total,
      0
    );

    if (paymentMethod === "Stripe") {
      const stripe = await stripePromise;
      const createLineItems = cartItems.map((item) => ({
        price_data: {
          currency: "INR",
          product_data: {
            images: [item.productID.imageUrl],
            name: item.productID.name,
          },
          unit_amount: item.productID.price * 100,
        },
        quantity: 1,
      }));
      const res = await callStripeSession(createLineItems);
      setIsOrderProcessing(true);
      localStorage.setItem("checkoutFormData", JSON.stringify(checkoutFormData));
      const { error } = await stripe.redirectToCheckout({ sessionId: res.id });
      if (error) console.log(error);
    } else if (paymentMethod === "Razorpay") {
      const res = await fetch("/api/razorpay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({ amount: totalPrice, currency: "INR" }),
      });

      const data = await res.json();
      if (!data.success) {
        toast.error(data.message || "Error initiating payment", {
          position: toast.POSITION.TOP_RIGHT,
        });
        return;
      }

      const isRazorpayLoaded = await loadRazorpayScript();
      if (!isRazorpayLoaded) {
        toast.error("Failed to load Razorpay script!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        return;
      }

      const options = {
        key: "rzp_test_YNiLz4wMTURtjU",
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Your Company",
        description: "Order Payment",
        order_id: data.order.id,
        handler: function (response) {
          toast.success("Payment successful!", {
            position: toast.POSITION.TOP_RIGHT,
          });
          setOrderSuccess(true);
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    }
  }

  if (orderSuccess) {
    setTimeout(() => {
      router.push("/orders");
    }, 2000);
    return (
      <section className="h-screen bg-gray-200">
        <div className="text-center text-black">Payment Successful!</div>
      </section>
    );
  }

  return (
    <div>
      {/* Rest of the Checkout Component */}
      <button onClick={() => handleCheckout()}>Pay Now</button>
    </div>
  );
}
