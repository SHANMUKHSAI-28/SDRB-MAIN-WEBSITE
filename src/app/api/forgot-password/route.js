// src/app/api/forgot-password/route.js
import { sendPasswordResetEmail } from "../../../services/email";
import User from "../../../models/user";

export async function POST(req) {
  const { email } = await req.json();

  const user = await User.findOne({ email });
  if (!user) {
    return new Response(JSON.stringify({ message: "Email not found" }), { status: 404 });
  }

  const token = crypto.randomUUID();
  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
  await user.save();

  await sendPasswordResetEmail(email, token);

  return new Response(JSON.stringify({ message: "Password reset email sent" }), { status: 200 });
}
