"use client";
import Notification from "@/components/Notification";
import { GlobalContext } from "@/context";
import { fetchAllAddresses } from "@/services/address";
import { createNewOrder } from "@/services/order";
import { callStripeSession } from "@/services/stripe";
import { createRazorpayOrder } from "@/services/razorpay";
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

  useEffect(() => {
    if (user) fetchAllAddresses(user._id).then((res) => setAddresses(res?.data || []));
  }, [user]);

  useEffect(() => {
    async function processOrder() {
      const paymentMethod = localStorage.getItem("paymentMethod");
      if (params.get("status") === "success" && cartItems?.length > 0) {
        setIsOrderProcessing(true);

        const orderData = {
          user: user?._id,
          shippingAddress: checkoutFormData.shippingAddress,
          orderItems: cartItems.map((item) => ({
            qty: 1,
            product: item.productID,
          })),
          paymentMethod,
          totalPrice: cartItems.reduce((total, item) => item.productID.price + total, 0),
          isPaid: paymentMethod === "Stripe",
          paidAt: paymentMethod === "Stripe" ? new Date() : null,
        };

        const res = await createNewOrder(orderData);

        setIsOrderProcessing(false);
        if (res.success) {
          setOrderSuccess(true);
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }
      }
    }

    processOrder();
  }, [params, cartItems]);

  const handleCheckout = async () => {
    const paymentMethod = localStorage.getItem("paymentMethod");
    const totalPrice = cartItems.reduce((total, item) => item.productID.price + total, 0);

    if (!paymentMethod || !totalPrice) {
      toast.error("Invalid payment method or empty cart.");
      return;
    }

    setIsOrderProcessing(true);
    localStorage.setItem("checkoutFormData", JSON.stringify(checkoutFormData));

    if (paymentMethod === "Stripe") {
      const stripe = await stripePromise;
      const session = await callStripeSession(
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

      const { error } = await stripe.redirectToCheckout({ sessionId: session.id });
      if (error) console.error(error.message);
    } else if (paymentMethod === "Razorpay") {
      const res = await createRazorpayOrder({ amount: totalPrice * 100, currency: "INR" });

      const options = {
        key: "your_razorpay_key_id",
        amount: res.order.amount,
        currency: res.order.currency,
        name: "Your Company",
        description: "Order Payment",
        order_id: res.order.id,
        handler: () => {
          toast.success("Payment successful!");
          setOrderSuccess(true);
        },
        prefill: { name: user?.name, email: user?.email },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    }
  };

  useEffect(() => {
    if (orderSuccess) {
      setTimeout(() => router.push("/orders"), 2000);
    }
  }, [orderSuccess]);

  return (
    <div>
      {isOrderProcessing ? (
        <div className="flex items-center justify-center min-h-screen">
          <PulseLoader color="#000000" size={30} />
        </div>
      ) : orderSuccess ? (
        <div className="h-screen bg-gray-200 flex items-center justify-center">
          <div className="bg-white p-10 rounded shadow">
            <h1 className="text-lg font-bold text-black">
              Payment successful! Redirecting to your orders page...
            </h1>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6 px-4 sm:px-10 lg:px-20">
          {/* Cart Summary */}
          <div>
            <h2 className="text-xl font-bold">Cart Summary</h2>
            <div className="space-y-4 mt-6">
              {cartItems?.length ? (
                cartItems.map((item) => (
                  <div className="flex items-center gap-4" key={item._id}>
                    <img
                      src={item.productID.imageUrl}
                      alt="Cart Item"
                      className="w-24 h-24 rounded-md"
                    />
                    <div>
                      <h3 className="font-bold">{item.productID.name}</h3>
                      <p>₹{item.productID.price}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>Your cart is empty</p>
              )}
            </div>
          </div>
          {/* Shipping Details */}
          <div>
            <h2 className="text-xl font-bold">Shipping Address Details</h2>
            {addresses?.length ? (
              <div className="space-y-4 mt-4">
                {addresses.map((address) => (
                  <div
                    key={address._id}
                    className={`p-4 border ${
                      selectedAddress === address._id ? "border-red-600" : ""
                    }`}
                    onClick={() => handleSelectedAddress(address)}
                  >
                    <p>{address.fullName}</p>
                    <p>{address.address}, {address.city}</p>
                    <p>{address.country}, {address.postalCode}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No addresses added. Add a new one.</p>
            )}
            <button
              onClick={() => router.push("/account")}
              className="mt-4 bg-black text-white px-4 py-2"
            >
              Add New Address
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
