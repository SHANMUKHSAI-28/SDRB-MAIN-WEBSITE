"use client";

import Notification from "@/components/Notification";
import { GlobalContext } from "@/context";
import { getAllOrdersForUser } from "@/services/order";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { PulseLoader } from "react-spinners";
import { toast } from "react-toastify";
import { Package2, Truck, Clock, ShoppingBag } from "lucide-react";

export default function Orders() {
  const {
    user,
    pageLevelLoader,
    setPageLevelLoader,
    allOrdersForUser,
    setAllOrdersForUser,
  } = useContext(GlobalContext);

  const router = useRouter();

  async function extractAllOrders() {
    setPageLevelLoader(true);
    const res = await getAllOrdersForUser(user?._id);

    if (res.success) {
      setPageLevelLoader(false);
      setAllOrdersForUser(res.data);
      toast.success(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      setPageLevelLoader(false);
      toast.error(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }

  useEffect(() => {
    if (user !== null) {
      extractAllOrders();
    }
  }, [user]);

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
    <section className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingBag className="h-8 w-8 text-gray-800" />
            <h1 className="text-3xl font-bold text-gray-900">Your Orders</h1>
          </div>
          <p className="text-base text-gray-600 ml-11">
            Track, return, or manage your orders
          </p>
        </div>
        <div className="space-y-6">
          {allOrdersForUser && allOrdersForUser.length ? (
            allOrdersForUser.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="border-b border-gray-100 bg-gray-50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-600">ORDER PLACED</p>
                      <p className="text-base font-medium text-gray-900">
                        {new Date(item.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-600">TOTAL</p>
                      <p className="text-xl font-bold text-gray-900">₹{item.totalPrice.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-6 p-3 rounded-md bg-gray-50">
                    {item.isProcessing ? (
                      <>
                        <Clock className="h-5 w-5 text-blue-600" />
                        <span className="text-base font-medium text-blue-600">Processing</span>
                      </>
                    ) : (
                      <>
                        <Truck className="h-5 w-5 text-green-600" />
                        <span className="text-base font-medium text-green-600">Delivered</span>
                      </>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    {item.orderItems.map((orderItem, index) => (
                      <div key={index} className="relative bg-gray-50 rounded-lg p-2">
                        <img
                          className="h-32 w-full object-cover rounded-md shadow-sm"
                          src={orderItem?.product?.imageUrl}
                          alt={orderItem?.product?.name}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => router.push(`/orders/${item._id}`)}
                      className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200"
                    >
                      <Package2 className="h-5 w-5 mr-2" />
                      View Order Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow-md">
              <Package2 className="mx-auto h-16 w-16 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No orders yet</h3>
              <p className="mt-2 text-base text-gray-600">Start shopping to create your first order</p>
              <div className="mt-8">
                <button
                  onClick={() => router.push('/')}
                  className="inline-flex items-center px-6 py-3 border border-transparent shadow-md text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200"
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Start Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Notification />
    </section>
  );
}