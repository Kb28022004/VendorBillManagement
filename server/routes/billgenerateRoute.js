const express = require('express');
const upload = require("../middleware/multer");


const router = express.Router();
const { createBill, getAllBills, getVendorsPersonalBill, updateBill, deleteBill, getPersonalBill } = require('../controllers/billGenerateController');
const { isAuthencated } = require('../middleware/auth');

router.post('/createbills',isAuthencated,upload.single('uploadBill'), createBill);
router.get('/getallbills',isAuthencated, getAllBills);
router.get('/singlebill/:id',isAuthencated, getVendorsPersonalBill);
router.get('/bill/:id',isAuthencated, getPersonalBill);
router.put('/bills/:id',isAuthencated, updateBill);
router.delete('/delete/:id',isAuthencated, deleteBill);

module.exports = router;
