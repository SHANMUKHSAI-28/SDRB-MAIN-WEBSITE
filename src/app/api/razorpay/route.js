import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: 'your_razorpay_key_id',
  key_secret: 'your_razorpay_key_secret',
});

export async function POST(req) {
  const { amount, currency, receipt } = await req.json();

  try {
    const order = await razorpay.orders.create({ amount, currency, receipt });
    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
