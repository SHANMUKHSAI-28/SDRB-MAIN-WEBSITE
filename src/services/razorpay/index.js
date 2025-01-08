import Cookies from "js-cookie";

export const callRazorpayOrder = async (formData) => {
  try {
    const res = await fetch("/api/razorpay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    return data;
  } catch (e) {
    console.log(e);
    return { success: false };
  }
};
