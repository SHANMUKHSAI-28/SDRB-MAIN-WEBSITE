"use client";

import Notification from "@/components/Notification";
import { GlobalContext } from "@/context";
import { fetchAllAddresses } from "@/services/address";
import { createNewOrder } from "@/services/order";
import { createRazorpayOrder } from "@/services/razorpay";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";
import { toast } from "react-toastify";
import { MapPin, ShoppingBag, Truck, Lock } from "lucide-react";
import Script from "next/script";

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

  async function getAllAddresses() {
    const res = await fetchAllAddresses(user?._id);
    if (res.success) {
      setAddresses(res.data);
    }
  }

  useEffect(() => {
    if (user !== null) getAllAddresses();
  }, [user]);

  function handleSelectedAddress(getAddress) {
    if (getAddress._id === selectedAddress) {
      setSelectedAddress(null);
      setCheckoutFormData({
        ...checkoutFormData,
        shippingAddress: {},
      });
      return;
    }

    setSelectedAddress(getAddress._id);
    setCheckoutFormData({
      ...checkoutFormData,
      shippingAddress: {
        ...checkoutFormData.shippingAddress,
        fullName: getAddress.fullName,
        city: getAddress.city,
        country: getAddress.country,
        postalCode: getAddress.postalCode,
        address: getAddress.address,
      },
    });
  }

  async function handleCheckout() {
    try {
      setIsOrderProcessing(true);

      const createLineItems = cartItems.map((item) => ({
        price_data: {
          currency: "INR",
          unit_amount: item.productID.price * 100,
          product_data: {
            name: item.productID.name,
            images: [item.productID.imageUrl],
          },
        },
        quantity: 1,
      }));

      const res = await createRazorpayOrder(createLineItems);

      if (!res.success) {
        toast.error(res.message);
        setIsOrderProcessing(false);
        return;
      }

      // Ensure Razorpay is loaded
      if (typeof window.Razorpay === "undefined") {
        toast.error("Razorpay SDK failed to load. Please refresh the page.");
        setIsOrderProcessing(false);
        return;
      }

      const options = {
        key: "rzp_test_YNiLz4wMTURtjU", // Replace with your Razorpay key ID
        amount: res.order.amount,
        currency: res.order.currency,
        name: "Your Store Name",
        description: "Purchase Description",
        order_id: res.order.id,
        handler: async function (response) {
          try {
            const orderData = {
              user: user?._id,
              shippingAddress: checkoutFormData.shippingAddress,
              orderItems: cartItems.map((item) => ({
                qty: 1,
                product: item.productID,
              })),
              paymentMethod: "Razorpay",
              totalPrice: cartItems.reduce(
                (total, item) => item.productID.price + total,
                0
              ),
              isPaid: true,
              isProcessing: true,
              paidAt: new Date(),
              razorpay: {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              },
            };

            const orderRes = await createNewOrder(orderData);

            if (orderRes.success) {
              setOrderSuccess(true);
              toast.success(orderRes.message);
            } else {
              toast.error(orderRes.message);
            }
          } catch (error) {
            console.error(error);
            toast.error("Something went wrong with order creation");
          } finally {
            setIsOrderProcessing(false);
          }
        },
        prefill: {
          name: checkoutFormData.shippingAddress.fullName,
          email: user?.email,
        },
        theme: {
          color: "#000000",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      setIsOrderProcessing(false);
    }
  }

  useEffect(() => {
    if (orderSuccess) {
      setTimeout(() => {
        router.push("/orders");
      }, 2000);
    }
  }, [orderSuccess]);

  if (orderSuccess) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-8 bg-white rounded-2xl shadow-lg">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Order Successful!
            </h1>
            <p className="text-gray-600 mb-6">
              Your payment has been processed successfully.
            </p>
            <div className="animate-pulse text-sm text-gray-500">
              Redirecting to orders page...
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isOrderProcessing) {
    return (
      <div className="w-full min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-gray-50 to-white">
        <PulseLoader
          color={"#000000"}
          loading={isOrderProcessing}
          size={20}
          data-testid="loader"
        />
        <p className="mt-4 text-gray-600">Processing your order...</p>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="beforeInteractive"
      />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Rest of your JSX remains unchanged */}
          <Notification />
        </div>
      </div>
    </>
  );
}
