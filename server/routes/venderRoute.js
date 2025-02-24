const express = require("express");
const { isAuthencated, authorizedRole } = require("../middleware/auth");
const upload = require("../middleware/multer");
const {
  createVendor,
  getAllVendors,
  updateVendor,
  getVenderDetail,
  getAllVendorsWithoutPagination,
 
  deleteVendor,
} = require("../controllers/vendorController");

const router = express.Router();

router.route("/admin/create").post(  isAuthencated, upload.single('profilePicture'), createVendor);
router.route("/admin/update/:id").put(isAuthencated,upload.single('profilePicture'), updateVendor);
router.route("/admin/delete/:id").delete(isAuthencated, deleteVendor);
router
  .route("/admin/allvendors")
  .get(isAuthencated,getAllVendorsWithoutPagination);
router.route("/getsinglevendor/:id").get(isAuthencated,getVenderDetail);
router.route("/getallvendors").get(isAuthencated, getAllVendors);

module.exports = router;
