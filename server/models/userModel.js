const validator = require("validator");

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Please provide users name"],
    },
    email: {
      type: String,
      required: [true, "Please provide users email"],
      unique: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide users password"],
      minLength: [8, "password should be atleast of 8 characters"],
      select: false,
    },
    cfpassword:{
      type: String,
      required: [true, "Please provide users password"],
      minLength: [8, "password should be atleast of 8 characters"],
     
    },

    otp: {
      otp: { type: String },
      token: { type: String },
      sendTime: { type: Number },
    },
    phoneNumber: {
      type: Number,
      required: [true, "Please provide your mobile number"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
