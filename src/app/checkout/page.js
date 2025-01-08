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

  useEffect(() => {
    async function createFinalOrder() {
      const paymentMethod = localStorage.getItem("paymentMethod");
      const isStripe = paymentMethod === "Stripe";

      if (
        params.get("status") === "success" &&
        cartItems &&
        cartItems.length > 0
      ) {
        setIsOrderProcessing(true);
        const getCheckoutFormData = JSON.parse(
          localStorage.getItem("checkoutFormData")
        );

        const createFinalCheckoutFormData = {
          user: user?._id,
          shippingAddress: getCheckoutFormData.shippingAddress,
          orderItems: cartItems.map((item) => ({
            qty: 1,
            product: item.productID,
          })),
          paymentMethod,
          totalPrice: cartItems.reduce(
            (total, item) => item.productID.price + total,
            0
          ),
          isPaid: isStripe,
          isProcessing: true,
          paidAt: isStripe ? new Date() : null,
        };

        const res = await createNewOrder(createFinalCheckoutFormData);

        if (res.success) {
          setIsOrderProcessing(false);
          setOrderSuccess(true);
          toast.success(res.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else {
          setIsOrderProcessing(false);
          setOrderSuccess(false);
          toast.error(res.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
    }

    createFinalOrder();
  }, [params.get("status"), cartItems]);

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

    if (paymentMethod === "Stripe") {
      const stripe = await stripePromise;
      const res = await callStripeSession(createLineItems);
      setIsOrderProcessing(true);
      localStorage.setItem("checkoutFormData", JSON.stringify(checkoutFormData));
      const { error } = await stripe.redirectToCheckout({
        sessionId: res.id,
      });
      if (error) console.log(error);
    } else if (paymentMethod === "Razorpay") {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Failed to load Razorpay script.");
        return;
      }

      const totalPrice = cartItems.reduce(
        (total, item) => item.productID.price + total,
        0
      );
      const res = await createRazorpayOrder({
        amount: totalPrice * 100,
        currency: "INR",
      });

      const options = {
        key: "your_razorpay_key_id",
        amount: res.order.amount,
        currency: res.order.currency,
        name: "Your Company",
        description: "Order Payment",
        order_id: res.order.id,
        handler: async function (response) {
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

  useEffect(() => {
    if (orderSuccess) {
      setTimeout(() => {
        router.push("/orders");
      }, 2000);
    }
  }, [orderSuccess]);

  if (orderSuccess) {
    return (
      <section className="h-screen bg-gray-200">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mt-8 max-w-screen-xl px-4 sm:px-6 lg:px-8 ">
            <div className="bg-white shadow">
              <div className="px-4 py-6 sm:px-8 sm:py-10 flex flex-col gap-5">
                <h1 className="font-bold text-lg text-black">
                  Your payment is successful and you will be redirected to the
                  orders page in 2 seconds!
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isOrderProcessing) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <PulseLoader
          color={"#000000"}
          loading={isOrderProcessing}
          size={30}
          data-testid="loader"
        />
      </div>
    );
  }

  return (
    <div>
      <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
        <div className="px-4 pt-8">
          <p className="font-medium text-xl text-black">Cart Summary</p>
          <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-5">
            {cartItems && cartItems.length ? (
              cartItems.map((item) => (
                <div
                  className="flex flex-col rounded-lg bg-white sm:flex-row"
                  key={item._id}
                >
                  <img
                    src={item && item.productID && item.productID.imageUrl}
                    alt="Cart Item"
                    className="m-2 h-24 w-28 rounded-md border object-cover object-center"
                  />
                  <div className="flex w-full flex-col px-4 py-4">
                    <span className="font-bold text-black">
                      {item && item.productID && item.productID.name}
                    </span>
                    <span className="font-semibold text-black">
                      {item && item.productID && item.productID.price}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-black">Your cart is empty</div>
            )}
          </div>
        </div>
        <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
          <p className="text-xl font-medium text-black">Shipping Address Details</p>
          <p className="text-gray-400 font-bold text-black">
            Complete your order by selecting an address below
          </p>
          <div className="w-full mt-6 mr-0 mb-0 ml-0 space-y-6">
            {addresses && addresses.length ? (
              addresses.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleSelectedAddress(item)}
                  className={`relative flex cursor-pointer justify-start items-center p-4 rounded-lg border-2 ${
                    selectedAddress === item._id
                      ? "border-[#233] bg-green-100"
                      : "border-gray-300 bg-gray-50"
                  }`}
                >
                  <div className="ml-4">
                    <p className="text-lg font-semibold">{item.fullName}</p>
                    <p className="mt-1 text-sm text-black">
                      {item.address}, {item.city}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>No addresses available.</p>
            )}
          </div>
          <button
            onClick={handleCheckout}
            className="mt-4 w-full text-white bg-blue-500 py-3 rounded-lg shadow hover:bg-blue-600"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
