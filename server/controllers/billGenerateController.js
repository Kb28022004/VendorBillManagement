const Bill = require("../models/billGenerateModel");
const Vendor = require("../models/vendorModel");

// Create a Bill - Admin or Authorized User
const createBill = async (req, res) => {
  try {
    const {
      vendorId,
      billName,
      billNumber,
      paymentMode,
      emi,
      dueDate,
      status,
      totalAmount,
      depositedAmount,
      remainingBalance,
      referenceNumber,
      emiPaymentMode,
    
    } = req.body;

    // Validate required fields
    if (!vendorId || !billName || !billNumber || !totalAmount) {
      return res
        .status(400)
        .json({
          message:
            "Missing required fields: vendorId, billName, billNumber, totalAmount",
        });
    }

    // Check if the vendor exists
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Check if the user is authenticated
    const user = req.user; // Assuming authentication middleware populates req.user
    if (!user) {
      return res.status(400).json({ message: "User not authenticated" });
    }

    // Handle profile picture
    let uploadBill = {};
    if (req.file) {
      uploadBill = {
        public_id: req.file.filename,
        url: req.file.path,
      };
    }

    // Create a new bill
    const newBill = new Bill({
      user: user._id,
      vendor: vendor._id,
      billName,
      billNumber,
      paymentMode,
      emi,
      depositedAmount,
      dueDate,
      status,
      totalAmount,
      remainingBalance,
      referenceNumber,
      emiPaymentMode,
      uploadBill,
    });

    const savedBill = await newBill.save();

    return res.status(201).json({
      success: true,
      message: "Bill created successfully",
      savedBill,
    });
  } catch (error) {
    console.error("Error creating bill:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get All Bills - Admin or Authorized User
const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find();

    const totalBills = await Bill.countDocuments();

    return res.status(200).json({
      success: true,
      totalBills,
      bills,
    });
  } catch (error) {
    console.error("Error fetching bills:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get Vendor's Personal Bills
const getVendorsPersonalBill = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Vendor ID is required" });
    }

    const vendorBills = await Bill.find({ vendor: id });

    if (!vendorBills.length) {
      return res
        .status(404)
        .json({ message: "No bills found for this vendor" });
    }

    return res.status(200).json({
      success: true,
      nbbills:vendorBills.length,
      vendorBills,
    });
  } catch (error) {
    console.error("Error fetching vendor bills:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getPersonalBill = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Bill ID is required" });
    }

    const bill = await Bill.findById(id );

    if (!bill) {
      return res
        .status(404)
        .json({ message: "No bills found " });
    }

    return res.status(200).json({
      success: true,
      nbbills:bill.length,
      bill,
    });
  } catch (error) {
    console.error("Error fetching  bills:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Update a Bill
const updateBill = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!id || Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ message: "Bill ID and updates are required" });
    }

    const updatedBill = await Bill.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedBill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Bill updated successfully",
      updatedBill,
    });
  } catch (error) {
    console.error("Error updating bill:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Delete a Bill
const deleteBill = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Bill ID is required" });
    }

    const deletedBill = await Bill.findByIdAndDelete(id);

    if (!deletedBill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Bill deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting bill:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// make payment



module.exports = {
  createBill,
  getAllBills,
  getVendorsPersonalBill,
  updateBill,
  deleteBill,
  getPersonalBill
};
