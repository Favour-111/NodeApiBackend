const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    Fullname: { type: String, required: true },
    NickName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    verificationToken: { type: String },
    verified: { type: Boolean, default: false },
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("users", userSchema);
module.exports = UserModel;
