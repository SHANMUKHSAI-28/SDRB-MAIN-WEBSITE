import Cookies from "js-cookie";

export const createRazorpayOrder = async (orderDetails) => {
  try {
    const response = await fetch("/api/razorpay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify(orderDetails),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw error;
  }
};
