import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_YNiLz4wMTURtjU', // Use environment variables for security
  key_secret: process.env.RAZORPAY_KEY_SECRET || '02iADMTpuOGFzwbiTO5kjVZ5',
});

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      // Parse the request body
      const { amount, currency = "INR", receipt } = req.body;

      if (!amount || !receipt) {
        return res.status(400).json({ error: "Missing required fields: amount, receipt" });
      }

      const options = {
        amount: Math.round(amount), // Ensure amount is in smallest currency unit (e.g., paise for INR)
        currency,
        receipt,
      };

      // Create Razorpay order
      const order = await razorpay.orders.create(options);

      return res.status(200).json(order);
    } else {
      // Handle non-POST methods
      res.setHeader("Allow", ["POST"]);
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Razorpay Order Creation Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
