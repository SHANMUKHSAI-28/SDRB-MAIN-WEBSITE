import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
