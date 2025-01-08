"use client";

import Notification from "@/components/Notification";
import { GlobalContext } from "@/context";
import { fetchAllAddresses } from "@/services/address";
import { createNewOrder } from "@/services/order";
import { callRazorpayOrder } from "@/services/razorpay";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";
import { toast } from "react-toastify";
import { MapPin, ShoppingBag, Truck, Lock } from "lucide-react";

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
      if (params.get("status") === "success" && cartItems && cartItems.length > 0) {
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
          paymentMethod: "Razorpay",
          totalPrice: cartItems.reduce(
            (total, item) => item.productID.price + total,
            0
          ),
          isPaid: true,
          isProcessing: true,
          paidAt: new Date(),
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

  async function handleCheckout() {
    const createLineItems = cartItems.map((item) => ({
      productName: item.productID.name,
      price: item.productID.price,
    }));

    const res = await callRazorpayOrder({
      totalPrice: cartItems.reduce((total, item) => item.productID.price + total, 0),
      lineItems: createLineItems,
    });

    setIsOrderProcessing(true);
    localStorage.setItem("checkoutFormData", JSON.stringify(checkoutFormData));

    if (res.success) {
      const options = {
        key: "rzp_test_YNiLz4wMTURtjU",
        amount: res.amount,
        currency: res.currency,
        name: "Your Company Name",
        description: "Test Transaction",
        order_id: res.orderId,
        handler: function (response) {
          localStorage.setItem("razorpay_payment_id", response.razorpay_payment_id);
          localStorage.setItem("razorpay_order_id", response.razorpay_order_id);
          localStorage.setItem("razorpay_signature", response.razorpay_signature);
          router.push("/checkout?status=success");
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      setIsOrderProcessing(false);
      toast.error("Failed to create Razorpay order", {
        position: toast.POSITION.TOP_RIGHT,
      });
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
      <section className="min-h-screen flex items-center justify-center">
        <div>Order Successful!</div>
      </section>
    );
  }

  if (isOrderProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PulseLoader color="#000000" loading={isOrderProcessing} size={20} />
        <p>Processing your order...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-5">
      <Notification />
      <div>
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <p>Select your shipping address:</p>
        {addresses.map((address) => (
          <div
            key={address._id}
            className={`border p-3 mb-2 ${
              selectedAddress === address._id ? "border-blue-500" : ""
            }`}
            onClick={() => handleSelectedAddress(address)}
          >
            <p>{address.fullName}</p>
            <p>{address.address}</p>
            <p>
              {address.city}, {address.country}, {address.postalCode}
            </p>
          </div>
        ))}
        <button
          className="mt-5 bg-blue-500 text-white py-2 px-4 rounded"
          onClick={handleCheckout}
          disabled={!selectedAddress || isOrderProcessing}
        >
          Pay with Razorpay
        </button>
      </div>
    </div>
  );
}
