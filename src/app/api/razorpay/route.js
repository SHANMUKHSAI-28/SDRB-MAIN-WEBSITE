import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: 'rzp_test_YNiLz4wMTURtjU',
  key_secret: '02iADMTpuOGFzwbiTO5kjVZ5',
});

export default async function handler(req, res) {
    try {
      if (req.method === "POST") {
        const { amount, currency, receipt } = req.body;
  
        const options = {
          amount, // amount in the smallest currency unit
          currency,
          receipt,
        };
  
        const order = await razorpay.orders.create(options);
  
        res.status(200).json(order);
      } else {
        res.status(405).json({ error: "Method not allowed" });
      }
    } catch (error) {
      console.error("Razorpay Order Creation Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  