"use client";

import ComponentLevelLoader from "@/components/Loader/componentlevel";
import { GlobalContext } from "@/context";
import { getAllOrdersForAllUsers, updateStatusOfOrder } from "@/services/order";
import { useContext, useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";

export default function AdminView() {
  const {
    setPageLevelLoader,
    setComponentLevelLoader,
    pageLevelLoader,
    componentLevelLoader,
  } = useContext(GlobalContext);

  const [allOrdersForAllUsers, setAllOrdersForAllUsers] = useState([]);

  // Fetch all orders for all users
  async function fetchAllOrders() {
    setPageLevelLoader(true);
    try {
      const res = await getAllOrdersForAllUsers();
      console.log("API Response:", res);

      if (res.success) {
        setAllOrdersForAllUsers(res.data || []);
      } else {
        console.error("Failed to fetch orders:", res.message);
        setAllOrdersForAllUsers([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setPageLevelLoader(false);
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, []);

  // Update the status of an order
  async function handleUpdateOrderStatus(order) {
    setComponentLevelLoader({ loading: true, id: order._id });
    try {
      const res = await updateStatusOfOrder({
        ...order,
        isProcessing: false,
      });

      if (res.success) {
        console.log("Order status updated successfully:", res);
        fetchAllOrders(); // Refresh the orders list
      } else {
        console.error("Failed to update order status:", res.message);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setComponentLevelLoader({ loading: false, id: "" });
    }
  }

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
    <section>
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-8 sm:py-10">
          <div className="flow-root">
            {allOrdersForAllUsers.length ? (
              <ul className="flex flex-col gap-4">
                {allOrdersForAllUsers.map((order) => (
                  <li
                    key={order._id}
                    className="bg-gray-200 shadow p-5 flex flex-col space-y-3 py-6 text-left"
                  >
                    <div className="flex">
                      <h1 className="font-bold text-lg mb-3 flex-1">
                        Order ID: {order._id}
                      </h1>
                      <div className="flex flex-col gap-2">
                        <p>
                          <span className="font-medium">User Name:</span>{" "}
                          {order.user?.name || "N/A"}
                        </p>
                        <p>
                          <span className="font-medium">User Email:</span>{" "}
                          {order.user?.email || "N/A"}
                        </p>
                        <p>
                          <span className="font-medium">Total Price:</span> $
                          {order.totalPrice}
                        </p>
                        <p>
                          <span className="font-medium">Order Status:</span>{" "}
                          {order.isProcessing ? "Processing" : "Delivered"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {order.orderItems.map((item, index) => (
                        <div key={index} className="shrink-0">
                          <img
                            alt="Product"
                            className="h-24 w-24 max-w-full rounded-lg object-cover"
                            src={item.product?.imageUrl || "/placeholder.jpg"}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-5">
                      <button
                        className="disabled:opacity-50 mt-5 mr-5 inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide"
                        disabled={!order.isProcessing}
                      >
                        {order.isProcessing
                          ? "Order is Processing"
                          : "Order Delivered"}
                      </button>
                      <button
                        onClick={() => handleUpdateOrderStatus(order)}
                        disabled={!order.isProcessing}
                        className="disabled:opacity-50 mt-5 mr-5 inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide"
                      >
                        {componentLevelLoader?.loading &&
                        componentLevelLoader.id === order._id ? (
                          <ComponentLevelLoader
                            text="Updating Order Status"
                            color="#ffffff"
                            loading={componentLevelLoader?.loading}
                          />
                        ) : (
                          "Update Order Status"
                        )}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No orders available.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
