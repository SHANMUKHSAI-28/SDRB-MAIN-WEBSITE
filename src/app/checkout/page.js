"use client";

import Notification from "@/components/Notification";
import { GlobalContext } from "@/context";
import { fetchAllAddresses } from "@/services/address";
import { createNewOrder } from "@/services/order";
import { createRazorpayOrder } from "@/services/razorpay";
import { redeemCoupon } from "@/services/coupon";
import { validateCouponData, calculateCouponDiscount } from "@/utils";
import { validateCoupon as validateCouponAPI } from "@/services/coupon";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";
import { toast } from "react-toastify";
import { MapPin, ShoppingBag, Truck, Lock } from 'lucide-react';
import Script from 'next/script';
import Cookies from "js-cookie";

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
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

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

      const options = {
        key: "rzp_test_YNiLz4wMTURtjU", // Replace with your Razorpay key ID
        amount: res.order.amount,
        currency: res.order.currency,        name: "SDRB Technologies",
        description: "Purchase Description",
        order_id: res.order.id,
        handler: async function (response) {
          try {
            const orderData = {
              user: user?._id,
              shippingAddress: checkoutFormData.shippingAddress,              orderItems: cartItems.map((item) => ({
                qty: item.quantity || 1,
                product: item.productID,
              })),
              paymentMethod: "Razorpay",
              totalPrice: cartItems.reduce((total, item) => item.productID.price + total, 0) - (couponDiscount || 0),
              coupon: appliedCoupon ? {
                code: appliedCoupon.coupon_code,
                discountAmount: couponDiscount,
              } : undefined,
              isPaid: true,
              isProcessing: true,
              paidAt: new Date(),
              razorpay: {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              },
            };
            const orderRes = await createNewOrder(orderData);            if (orderRes.success) {
              // If there's an applied coupon, redeem it
              if (appliedCoupon && appliedCoupon.coupon_code) {
                try {
                  // Validate coupon again before redeeming to ensure it's still valid
                  const validationResponse = await fetch('https://www.sdrbtechnologies.com/api/coupon/validate-coupon', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${Cookies.get("token")}`,
                    },
                    body: JSON.stringify({
                      coupon_code: appliedCoupon.coupon_code,
                      user_id: user?._id,
                      order_value: orderData.totalPrice + couponDiscount,
                      product_category: cartItems[0]?.productID?.category || 'SMARTSWITCH',
                      products: cartItems.map(item => item.productID._id),
                    }),
                  });
                  
                  const validationData = await validationResponse.json();
                  if (!validationData.is_valid) {
                    toast.error('Coupon is no longer valid: ' + validationData.message);
                    return;
                  }

                  const redeemResponse = await fetch('https://www.sdrbtechnologies.com/api/coupon/redeem-coupon', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${Cookies.get("token")}`,
                    },
                    body: JSON.stringify({
                      coupon_code: appliedCoupon.coupon_code,
                      user_id: user?._id,
                      order_id: orderRes.data._id,
                      order_value: cartItems.reduce((total, item) => item.productID.price + total, 0),
                      product_category: 'SMARTSWITCH', // You may need to adjust this based on your products
                      products: cartItems.map(item => item.productID._id),
                    }),
                  });
                  
                  const redeemData = await redeemResponse.json();
                  if (!redeemData.is_redeemed) {
                    console.warn('Coupon redemption failed:', redeemData.message);
                  }
                } catch (error) {
                  console.error('Error redeeming coupon:', error);
                }
              }
              
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

  async function handleCouponApply() {
    const validation = validateCouponData(couponCode, user, cartItems);
    
    if (!validation.isValid) {
      validation.errors.forEach(error => toast.error(error));
      return;
    }

    const result = await validateCoupon(couponCode, user, cartItems);
    
    if (result.success) {
      const discount = calculateCouponDiscount(
        result.data.discount_type, 
        result.data.discount_value, 
        validation.orderValue
      );
      setCouponDiscount(discount);
      setAppliedCoupon(result.data);
      toast.success('Coupon applied successfully!');
    } else {
      setCouponDiscount(0);
      setAppliedCoupon(null);
      toast.error(result.message || 'Invalid coupon code');
    }
  }

  useEffect(() => {
    if (orderSuccess) {
      setTimeout(() => {
        router.push("/orders");
      }, [2000]);
    }
  }, [orderSuccess]);

  if (orderSuccess) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-8 bg-white rounded-2xl shadow-lg">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Successful!</h1>
            <p className="text-gray-600 mb-6">Your payment has been processed successfully.</p>
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
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Lock className="w-4 h-4" />
              <span>Secure Checkout</span>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column - Cart Summary */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center space-x-2 mb-6">
                  <ShoppingBag className="w-5 h-5 text-gray-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
                </div>
                <div className="space-y-4">
                  {cartItems && cartItems.length ? (
                    cartItems.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl"
                      >
                        <img
                          src={item?.productID?.imageUrl}
                          alt={item?.productID?.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{item?.productID?.name}</h3>
                          <p className="text-lg font-semibold text-gray-900 mt-1">
                            ₹{item?.productID?.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">Your cart is empty</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Shipping & Payment */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center space-x-2 mb-6">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Shipping Address</h2>
                </div>
                
                <div className="space-y-4">
                  {addresses && addresses.length ? (
                    addresses.map((item) => (
                      <div
                        key={item._id}
                        onClick={() => handleSelectedAddress(item)}
                        className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          item._id === selectedAddress
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{item.fullName}</p>
                            <p className="text-gray-600 mt-1">{item.address}</p>
                            <p className="text-gray-600">{item.city}, {item.country} {item.postalCode}</p>
                          </div>
                          {item._id === selectedAddress && (
                            <span className="text-blue-500 text-sm font-medium">Selected</span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No addresses added</p>
                  )}
                  
                  <button
                    onClick={() => router.push("/account")}
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Add New Address
                  </button>
                </div>
              </div>

              {/* Order Summary & Checkout */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{cartItems?.reduce((total, item) => item.productID.price + total, 0)?.toLocaleString() || "0"}</span>
                  </div>
                  <div className="space-y-4 mb-6">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <button
                        onClick={handleCouponApply}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                        disabled={!couponCode}
                      >
                        Apply
                      </button>
                    </div>
                    {appliedCoupon && (
                      <div className="text-sm text-green-600">
                        Coupon applied: {appliedCoupon.description}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Discount</span>
                      <span className="text-green-600">-₹{couponDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="h-px bg-gray-200 my-4"></div>
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span>₹{(cartItems?.reduce((total, item) => item.productID.price + total, 0) - couponDiscount)?.toLocaleString() || "0"}</span>
                  </div>
                  
                  <button
                    onClick={handleCheckout}
                    disabled={
                      (cartItems && cartItems.length === 0) ||
                      Object.keys(checkoutFormData.shippingAddress).length === 0
                    }
                    className="w-full mt-6 bg-black text-white py-4 px-6 rounded-xl font-medium hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Lock className="w-4 h-4" />
                      <span>Pay Securely</span>
                    </div>
                  </button>
                  
                  <div className="flex items-center justify-center space-x-2 mt-4 text-sm text-gray-500">
                    <Truck className="w-4 h-4" />
                    <span>Free delivery within 3-5 business days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Notification />
      </div>
    </>
  );
}