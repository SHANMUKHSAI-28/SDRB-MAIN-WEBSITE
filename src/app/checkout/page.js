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

  const stripePromise = loadStripe(
    "pk_test_51OPFRtSJA9GAEIjE6wRcmZj7YuO4g0Md53AhigtPWcLzPDQte5QeVeTZaSGlJEuV9vKMoaLjCSRg6PH1oCwcuOPR00TqPDos3Y"
  );

  const subtotal = cartItems.reduce(
    (total, item) => item.productID.price + total,
    0
  );

  useEffect(() => {
    if (user) fetchAllAddresses(user._id).then((res) => {
      if (res.success) setAddresses(res.data);
    });
  }, [user]);

  useEffect(() => {
    async function createFinalOrder() {
      const paymentMethod = localStorage.getItem("paymentMethod");
      const isStripe = paymentMethod === "Stripe";

      if (
        params.get("status") === "success" &&
        cartItems.length > 0
      ) {
        setIsOrderProcessing(true);
        const savedFormData = JSON.parse(localStorage.getItem("checkoutFormData"));

        const orderData = {
          user: user._id,
          shippingAddress: savedFormData.shippingAddress,
          orderItems: cartItems.map((item) => ({
            qty: 1,
            product: item.productID,
          })),
          paymentMethod,
          totalPrice: subtotal,
          isPaid: isStripe,
          isProcessing: true,
          paidAt: isStripe ? new Date() : null,
        };

        const res = await createNewOrder(orderData);
        setIsOrderProcessing(false);
        if (res.success) {
          setOrderSuccess(true);
          toast.success(res.message, { position: toast.POSITION.TOP_RIGHT });
        } else {
          toast.error(res.message, { position: toast.POSITION.TOP_RIGHT });
        }
      }
    }

    createFinalOrder();
  }, [params, cartItems]);

  const handleSelectedAddress = (address) => {
    const isSame = address._id === selectedAddress;
    setSelectedAddress(isSame ? null : address._id);
    setCheckoutFormData({
      ...checkoutFormData,
      shippingAddress: isSame
        ? {}
        : {
            fullName: address.fullName,
            city: address.city,
            country: address.country,
            postalCode: address.postalCode,
            address: address.address,
          },
    });
  };

  const handleCheckout = async () => {
    const paymentMethod = localStorage.getItem("paymentMethod");
    localStorage.setItem("checkoutFormData", JSON.stringify(checkoutFormData));

    if (paymentMethod === "Stripe") {
      const stripe = await stripePromise;
      const res = await callStripeSession(
        cartItems.map((item) => ({
          price_data: {
            currency: "INR",
            product_data: {
              images: [item.productID.imageUrl],
              name: item.productID.name,
            },
            unit_amount: item.productID.price * 100,
          },
          quantity: 1,
        }))
      );

      setIsOrderProcessing(true);
      const { error } = await stripe.redirectToCheckout({ sessionId: res.id });
      if (error) console.error(error);
    } else if (paymentMethod === "Razorpay") {
      try {
        const res = await fetch("/api/razorpay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: subtotal, currency: "INR" }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to initiate payment");

        const razorpay = new window.Razorpay({
          key: "rzp_test_YNiLz4wMTURtjU",
          amount: data.amount,
          currency: data.currency,
          name: "Your Company",
          description: "Order Payment",
          order_id: data.id,
          handler: () => {
            toast.success("Payment successful!", {
              position: toast.POSITION.TOP_RIGHT,
            });
            setOrderSuccess(true);
          },
          prefill: { name: user.name, email: user.email },
        });

        razorpay.open();
      } catch (error) {
        toast.error("Payment initiation failed!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (orderSuccess) {
      setTimeout(() => router.push("/orders"), 2000);
    }
  }, [orderSuccess]);

  if (orderSuccess) {
    return (
      <section className="h-screen bg-gray-200">
        <div className="mx-auto max-w-screen-xl px-4 py-10">
          <div className="bg-white shadow px-6 py-8 text-center">
            <h1 className="text-xl font-bold text-black">
              Payment successful! Redirecting to your orders in 2 seconds...
            </h1>
          </div>
        </div>
      </section>
    );
  }

  if (isOrderProcessing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <PulseLoader color="#000" loading size={30} />
      </div>
    );
  }

  return (
    <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
      <div className="px-4 pt-8">
        <h2 className="font-medium text-xl text-black">Cart Summary</h2>
        <div className="mt-8 space-y-3 rounded-lg border bg-white px-4 py-6">
          {cartItems.length ? (
            cartItems.map((item) => (
              <div className="flex items-center space-x-4" key={item._id}>
                <img
                  src={item.productID.imageUrl}
                  alt="Cart Item"
                  className="h-20 w-20 rounded-lg object-cover"
                />
                <div>
                  <p className="font-semibold text-black">
                    {item.productID.name}
                  </p>
                  <p className="font-bold text-black">₹{item.productID.price}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-black">Your cart is empty</p>
          )}
        </div>
      </div>
      <div className="mt-10 px-4 pt-8 bg-gray-50 lg:mt-0">
        <h2 className="font-medium text-xl text-black">Shipping Address</h2>
        <p className="text-gray-400">Select an address below</p>
        <div className="space-y-4 mt-6">
          {addresses.length ? (
            addresses.map((address) => (
              <div
                key={address._id}
                className={`p-4 border rounded-lg cursor-pointer ${
                  address._id === selectedAddress ? "border-red-600" : ""
                }`}
                onClick={() => handleSelectedAddress(address)}
              >
                <p className="text-black">{address.fullName}</p>
                <p className="text-black">{address.address}</p>
                <p className="text-black">{address.city}, {address.country}</p>
                <p className="text-black">{address.postalCode}</p>
              </div>
            ))
          ) : (
            <p className="text-black">No addresses available</p>
          )}
        </div>
        <button
          onClick={() => router.push("/account")}
          className="mt-4 w-full bg-black text-white py-2 rounded-md"
        >
          Add New Address
        </button>
        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between">
            <p className="text-sm font-medium">Subtotal</p>
            <p className="text-lg font-bold">₹{subtotal}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm font-medium">Shipping</p>
            <p className="text-lg font-bold">Free</p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm font-medium">Total</p>
            <p className="text-lg font-bold">₹{subtotal}</p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <button
            onClick={() => {
              localStorage.setItem("paymentMethod", "Stripe");
              handleCheckout();
            }}
            className="w-full bg-black text-white py-2 rounded-md"
          >
            Pay with Stripe
          </button>
          <button
            onClick={() => {
              localStorage.setItem("paymentMethod", "Razorpay");
              handleCheckout();
            }}
            className="w-full bg-green-500 text-white py-2 rounded-md"
          >
            Pay with Razorpay
          </button>
        </div>
      </div>
    </div>
  );
}
