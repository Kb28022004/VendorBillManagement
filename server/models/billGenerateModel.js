const mongoose = require("mongoose");

const billGenerateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    vendor: {
      type: mongoose.Schema.ObjectId,
      ref: "Vendor",
      required: true,
    },
    billName: {
      type: String,
      required: true,
    },
    billNumber: {
      type: Number,
      required: true,
    },
    paymentMode: {
      type: String,
      default: "Offline",
    },
    emi: {
      type: Number,
      default: 0,
    },
    dueDate: {
      type: String,
    },
    status: {
      type: String,
      default: "deactive",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    depositedAmount: {
      type: Number,
      default: 0,
    },
    remainingBalance: {
      type: Number,
      default: 0,
    },
    referenceNumber: {
      type: String,
    },
    emiPaymentMode: {
      type: String,
    },
    uploadBill: {
      public_id: String,
      url: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bill", billGenerateSchema);
