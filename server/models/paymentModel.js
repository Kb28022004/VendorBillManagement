const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
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

    bill: {
      type: mongoose.Schema.ObjectId,
      ref: "Bill",
      required: true,
    },
    paymentDate: {
      type: String,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMode: {
      type: String,
    },

    paymentEmi: {
      type: String,
      required: true,
    },
    referenceNumber: {
      type: String,
    },
    nextDueDate: {
      type: String,
    },
    paymentDescription: {
      type: String,
    },
    status: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", paymentSchema);
