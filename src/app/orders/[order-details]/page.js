"use client";

import { GlobalContext } from "@/context";
import { getOrderDetails } from "@/services/order";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { PulseLoader } from "react-spinners";
import { Package2, Truck, MapPin, User, Calendar, Clock, ArrowLeft, ShoppingBag } from "lucide-react";

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
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <button
            onClick={() => router.push('/orders')}
            className="text-base font-medium text-gray-600 hover:text-gray-900 mb-4 inline-flex items-center"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Orders
          </button>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-8 w-8 text-gray-800" />
                <h1 className="text-2xl font-bold text-gray-900">
                  Order #{orderDetails?._id}
                </h1>
              </div>
              <div className="mt-3 flex items-center text-base text-gray-600 ml-11">
                <Calendar className="h-5 w-5 mr-2" />
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
                <div className="flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full">
                  <Clock className="h-5 w-5 mr-2" />
                  <span className="font-medium">Processing</span>
                </div>
              ) : (
                <div className="flex items-center bg-green-50 text-green-700 px-4 py-2 rounded-full">
                  <Truck className="h-5 w-5 mr-2" />
                  <span className="font-medium">Delivered</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Items</h2>
                <div className="space-y-6">
                  {orderDetails?.orderItems?.map((item) => (
                    <div key={item._id} className="flex items-center space-x-6 bg-gray-50 p-4 rounded-lg">
                      <div className="flex-shrink-0 w-32 h-32">
                        <img
                          src={item?.product?.imageUrl}
                          alt={item?.product?.name}
                          className="w-full h-full object-cover rounded-md shadow-sm"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {item?.product?.name}
                        </h3>
                        <p className="mt-2 text-xl font-semibold text-gray-900">
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
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between p-3 bg-gray-50 rounded-md">
                    <span className="text-gray-700">Subtotal</span>
                    <span className="font-medium text-gray-900">₹{orderDetails?.totalPrice?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-md">
                    <span className="text-gray-700">Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="p-4 bg-black text-white rounded-md">
                    <div className="flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="font-semibold">₹{orderDetails?.totalPrice?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer Details</h2>
                <div className="space-y-6">
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <User className="h-6 w-6 text-gray-600 mr-4" />
                    <div>
                      <p className="font-medium text-gray-900">{user?.name}</p>
                      <p className="text-gray-600">{user?.email}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start">
                      <MapPin className="h-6 w-6 text-gray-600 mr-4 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900 mb-2">Shipping Address</p>
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
              className="w-full bg-black text-white py-4 px-6 rounded-lg hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center shadow-md"
            >
              <Package2 className="h-6 w-6 mr-2" />
              <span className="text-lg font-medium">Continue Shopping</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}