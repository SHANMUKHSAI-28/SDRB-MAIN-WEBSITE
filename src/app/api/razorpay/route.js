import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_YNiLz4wMTURtjU',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '02iADMTpuOGFzwbiTO5kjVZ5',
});

export async function POST(req, res) {
  try {
    // Parse the request body
    const body = await req.json();
    const { amount, currency = "INR", receipt } = body;

    if (!amount || !receipt) {
      return res.status(400).json({ error: "Missing required fields: amount, receipt" });
    }

    const options = {
      amount: Math.round(amount), // Amount in smallest currency unit
      currency,
      receipt,
    };

    // Create Razorpay order
    const order = await razorpay.orders.create(options);

    return res.status(200).json(order);
  } catch (error) {
    console.error("Razorpay Order Creation Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
