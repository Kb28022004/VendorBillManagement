const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide course name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide vendor email"],
    },
    profilePicture: {
      public_id: String,
      url: String,
    },
    phone: {
      type: Number,
      maxLength: [10, "Phone number should be of 10 numbers only"],
      required: [true, "Please provide phone number"],
    },
    dob: {
      type: String,
      required: [true, "Please provide vendor's date of birth"],
    },
    gender: {
      type: String,
      required: [true, "Please provide vendor's gender"],
    },
    city: {
      type: String,
      required: [true, "Please provide vendor's city"],
    },
    country: {
      type: String,
      required: [true, "Please provide vendor's country"],
    },
    address: {
      type: String,
      required: [true, "Please provide vendor's address"],
    },
    postal: {
      type: String,
      required: [true, "Please provide vendor's postal code"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Vendor", vendorSchema);
