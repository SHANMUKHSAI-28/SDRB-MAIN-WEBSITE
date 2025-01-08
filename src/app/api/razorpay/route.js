const express = require("express");
const Razorpay = require("razorpay");
const router = express.Router();

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: "rzp_test_YNiLz4wMTURtjU", // Replace with your Razorpay Key ID
  key_secret: "02iADMTpuOGFzwbiTO5kjVZ5", // Replace with your Razorpay Key Secret
});

router.post("/razorpay", async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const options = {
      amount, // Amount in paise
      currency,
      receipt: `receipt_${Math.random().toString(36).substring(7)}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
});

module.exports = router;
