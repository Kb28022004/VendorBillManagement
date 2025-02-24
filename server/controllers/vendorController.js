const Vendor = require("../models/vendorModel");
const ApiFeature = require("../utils/apiFeatures");
const dotenv = require("dotenv");
const { cloudinary } = require("../utils/cloudinaryConfig");

dotenv.config();

// create vendor -- admin

// Create Vendor with Profile Picture
const createVendor = async (req, res) => {
  try {
    const { name, email, phone, dob, gender, city, address, country, postal } =
      req.body;

    // Check if vendor already exists
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res.status(400).json({
        success: false,
        message: "Vendor already exists with this email",
      });
    }

    // Handle profile picture
    let profilePicture = {};
    if (req.file) {
      profilePicture = {
        public_id: req.file.filename,
        url: req.file.path,
      };
    }

    // Create new vendor
    const newVendor = await Vendor.create({
      name,
      email,
      phone,
      dob,
      gender,
      city,
      address,
      country,
      postal,
      user: req.user.id,
      profilePicture,
    });

    res.status(201).json({
      success: true,
      message: "Vendor created successfully",
      newVendor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// get all vendors -- user-specific (only vendors created by the logged-in user)

const getAllVendors = async (req, res) => {
  try {
    const resultPerPage = 5;
    const vendorCounts = await Vendor.countDocuments({ user: req.user.id }); // Count vendors for the logged-in user
    const apiFeatures = new ApiFeature(
      Vendor.find({ user: req.user.id }),
      req.query
    ) // Filter by user ID
      .search()
      .filter()
      .pagination(resultPerPage);

    const vendors = await apiFeatures.query;

    res.status(200).json({
      nbVendors: vendors.length,
      success: true,
      vendorCounts,
      vendors,
      resultPerPage,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unable to get all the vendors due to internal server error",
    });
  }
};

// get a single course

const getVenderDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await Vendor.findById(id);
    if (!vendor) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    res.status(200).json({ success: true, vendor });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unable to get all the courses due to internal server error",
    });
  }
};

const updateVendor = async (req, res) => {
  try {
    const { name, email, phone, address, city, postal, country, gender, dob } = req.body;
    const { id } = req.params;

    // Find the existing vendor
    const vendor = await Vendor.findById(id);
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    // Check if a new profile picture is uploaded
    if (req.file) {
      // Delete the old profile picture from Cloudinary
      if (vendor.profilePicture && vendor.profilePicture.public_id) {
        await cloudinary.uploader.destroy(vendor.profilePicture.public_id);
      }

      // Assign the new profile picture
      vendor.profilePicture = {
        public_id: req.file.filename, // Cloudinary filename
        url: req.file.path, // Cloudinary URL
      };
    }

    // Prepare updated fields
    const updatedVendorDetails = {
      ...(name && { name }),
      ...(email && { email }),
      ...(dob && { dob }),
      ...(phone && { phone }),
      ...(gender && { gender }),
      ...(city && { city }),
      ...(address && { address }),
      ...(country && { country }),
      ...(postal && { postal }),
      ...(vendor.profilePicture && { profilePicture: vendor.profilePicture }), // Add profilePicture if exists
    };

    // Update the vendor in the database
    const updatedVendor = await Vendor.findByIdAndUpdate(
      id,
      { $set: updatedVendorDetails },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Vendor has been updated successfully",
      vendor: updatedVendor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Unable to update vendor due to internal server error",
    });
  }}

// delete course -- access by an admin

const deleteVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await Vendor.findByIdAndDelete(id);
    if (!vendor) {
      return res
        .status(404)
        .json({ success: false, message: "vendor not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "vendor has been deleted succesfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unable to get all the courses due to internal server error",
    });
  }
};

// get all courses -- admin

const getAllVendorsWithoutPagination = async (req, res) => {
  try {
    const vendors = await Vendor.find({ user: req.user.id });
    if (!vendors) {
      return res
        .status(404)
        .json({ success: false, message: "vendors are not found" });
    }
    res.status(200).json({ success: true, vendors });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unable to get all the vendors due to internal server error",
    });
  }
};

module.exports = {
  createVendor,
  getAllVendors,
  getVenderDetail,
  updateVendor,
  deleteVendor,
  getAllVendorsWithoutPagination,
};
