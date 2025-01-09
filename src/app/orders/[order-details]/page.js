"use client";

import { GlobalContext } from "@/context";
import { getOrderDetails } from "@/services/order";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { PulseLoader } from "react-spinners";
import { Package2, Truck, MapPin, User, Calendar, Clock } from "lucide-react";

export default function OrderDetails() {
  const {
    pageLevelLoader,
    setPageLevelLoader,
    orderDetails,
    setOrderDetails,
    user,
  } = useContext(GlobalContext);

  const params = useParams();
  const router = useRouter();

  async function extractOrderDetails() {
    setPageLevelLoader(true);
    const res = await getOrderDetails(params["order-details"]);
    if (res.success) {
      setPageLevelLoader(false);
      setOrderDetails(res.data);
    } else {
      setPageLevelLoader(false);
    }
  }

  useEffect(() => {
    extractOrderDetails();
  }, []);

  if (pageLevelLoader) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <PulseLoader
          color={"#000000"}
          loading={pageLevelLoader}
          size={30}
          data-testid="loader"
        />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => router.push('/orders')}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 mb-4 inline-flex items-center"
          >
            ← Back to Orders
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Order #{orderDetails?._id}
              </h1>
              <div className="mt-2 flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                {orderDetails?.createdAt && new Date(orderDetails.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
            <div className="flex items-center">
              {orderDetails?.isProcessing ? (
                <div className="flex items-center text-blue-600">
                  <Clock className="h-5 w-5 mr-2" />
                  <span className="font-medium">Processing</span>
                </div>
              ) : (
                <div className="flex items-center text-green-600">
                  <Truck className="h-5 w-5 mr-2" />
                  <span className="font-medium">Delivered</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
                <div className="space-y-6">
                  {orderDetails?.orderItems?.map((item) => (
                    <div key={item._id} className="flex items-center space-x-6">
                      <div className="flex-shrink-0 w-24 h-24">
                        <img
                          src={item?.product?.imageUrl}
                          alt={item?.product?.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-medium text-gray-900">
                          {item?.product?.name}
                        </h3>
                        <p className="mt-1 text-lg font-semibold text-gray-900">
                          ₹{item?.product?.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{orderDetails?.totalPrice?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="font-semibold">₹{orderDetails?.totalPrice?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Details</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{user?.name}</p>
                      <p className="text-gray-600">{user?.email}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900">Shipping Address</p>
                        <p className="text-gray-600">{orderDetails?.shippingAddress?.address}</p>
                        <p className="text-gray-600">
                          {orderDetails?.shippingAddress?.city}, {orderDetails?.shippingAddress?.country} {orderDetails?.shippingAddress?.postalCode}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => router.push('/')}
              className="w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center"
            >
              <Package2 className="h-5 w-5 mr-2" />
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}