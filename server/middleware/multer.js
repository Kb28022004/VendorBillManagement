const multer = require("multer");
const { storage } = require("../utils/cloudinaryConfig"); // Import the storage configuration from Cloudinary
const upload = multer({ storage }); // Use the storage configuration

module.exports = upload;
