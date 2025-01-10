// src/app/api/reset-password/route.js
import User from "../../../models/user";

export async function POST(req) {
  const { token, password } = await req.json();

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return new Response(JSON.stringify({ message: "Invalid or expired token" }), { status: 400 });
  }

  user.password = password; // Hash the password in a real-world app
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  return new Response(JSON.stringify({ message: "Password reset successful", success: true }), {
    status: 200,
  });
}
