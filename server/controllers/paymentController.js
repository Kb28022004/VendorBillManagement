const express = require("express");
const asyncHandler = require("express-async-handler");
const Payment = require("../models/paymentModel");
const Vendor = require("../models/vendorModel");
const Bill = require("../models/billGenerateModel");
const User = require("../models/userModel");

const router = express.Router();

// ✅ Create Payment API
const createPayment = asyncHandler(async (req, res) => {
  const {
    vendorId,
    billId,
    paymentDate,
    totalAmount,
    paymentMode,
    paymentEmi,
    referenceNumber,
    nextDueDate,
    paymentDescription,
    status,
  } = req.body;

  if (!vendorId || !billId || !totalAmount || !paymentEmi) {
    return res
      .status(400)
      .json({ message: "All required fields must be filled." });
  }

  const vendor = await Vendor.findById(vendorId);
  const bill = await Bill.findById(billId);
  const user = req.user; // Assuming authentication middleware

  if (!user) {
    return res.status(401).json({ message: "User not authenticated" });
  }
  if (!vendor) return res.status(404).json({ message: "Vendor not found." });
  if (!bill) return res.status(404).json({ message: "Bill not found." });

  const payment = await Payment.create({
    user: user._id,
    vendor: vendorId,
    bill: billId,
    paymentDate: paymentDate || new Date().toISOString(),
    totalAmount,
    paymentMode,
    paymentEmi,
    referenceNumber,
    nextDueDate,
    paymentDescription,
    status: status || "Pending",
  });

  res.status(201).json({
    success: true,
    message: "Payment created successfully.",
    payment,
  });
});

// ✅ Get All Payments for a Particular Bill of a Vendor
const getSingleBillAllPayments = asyncHandler(async (req, res) => {
  const { vendorId, billId } = req.params;

  if (!vendorId || !billId) {
    return res
      .status(400)
      .json({ success: false, message: "Vendor ID and Bill ID are required." });
  }

  const vendor = await Vendor.findById(vendorId);
  const bill = await Bill.findById(billId);

  if (!vendor) return res.status(404).json({ message: "Vendor not found." });
  if (!bill) return res.status(404).json({ message: "Bill not found." });

  const payments = await Payment.find({ vendor: vendorId, bill: billId });

  res.status(200).json({
    success: true,
    message: payments.length
      ? "Payments fetched successfully."
      : "No payments found for this bill.",
    payments,
  });
});

// ✅ Get All Bills with Payments for a Vendor (New API)
const getVendorBillsWithPayments = asyncHandler(async (req, res) => {
 try {
   const { vendorId } = req.params;
 
   const vendor = await Vendor.findById(vendorId);
   if (!vendor) {
     return res.status(404).json({ success: false, message: "Vendor not found." });
   }
 
   // Fetch all bills for the vendor
   const bills = await Bill.find({ vendor: vendorId });
 
   // Attach payments to each bill
   const billsWithPayments = await Promise.all(
     bills.map(async (bill) => {
       const payments = await Payment.find({ bill: bill._id });
       return { ...bill._doc, payments };
     })
   );
 
   res.status(200).json({
     success: true,
     message: "Vendor bills with payments fetched successfully.",
     vendor: {
       id: vendor._id,
       name: vendor.name,
       email: vendor.email,
       profilePicture:vendor.profilePicture
     },
     bills: billsWithPayments,
   });
 } catch (error) {
  return res.status(500).json({success:false,message:"Internal server error"})
 }
});

// get all vendors with their total bill and bill's payments

const getAllVendorsWithAllBillsPayment = asyncHandler(async (req, res) => {
  try {
    // Fetch vendors for the logged-in user
    const vendors = await Vendor.find({ user: req.user.id });  // Filter vendors by the logged-in user's ID

    if (!vendors || vendors.length === 0) {
      return res.status(404).json({ success: false, message: "No vendors found." });
    }

    const vendorsWithBillsPayments = await Promise.all(
      vendors.map(async (vendor) => {
        // Get all bills for the vendor, also filter by the logged-in user's ID (just in case)
        const bills = await Bill.find({ vendor: vendor._id, user: req.user.id });  // Filter bills by user

        // Calculate total payments for each bill
        const billsWithPayments = await Promise.all(
          bills.map(async (bill) => {
            const payments = await Payment.find({ bill: bill._id });  // Fetch payments related to the bill
            const totalPayments = payments.reduce((acc, payment) => acc + payment.totalAmount, 0);

            return {
              ...bill._doc,
              payments,
              totalPayments,
            };
          })
        );

        return {
          vendor: {
            id: vendor._id,
            name: vendor.name,
            email: vendor.email,
          },
          bills: billsWithPayments,
        };
      })
    );

    res.status(200).json({
      success: true,
      message: "Vendors with bills and payments fetched successfully.",
      vendors: vendorsWithBillsPayments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});





module.exports = { createPayment, getSingleBillAllPayments, getVendorBillsWithPayments,getAllVendorsWithAllBillsPayment };
