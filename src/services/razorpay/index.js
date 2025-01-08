export async function createRazorpayOrder(orderDetails) {
    const response = await fetch('/api/razorpay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderDetails),
    });
    return response.json();
  }
  