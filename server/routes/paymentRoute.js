
const { isAuthencated } = require('../middleware/auth');

const express=require('express')
const { createPayment, getSingleBillAllPayments, getVendorBillsWithPayments, getAllVendorsWithAllBillsPayment } = require('../controllers/paymentController')

const router=express.Router()

router.route('/create').post( isAuthencated, createPayment)
router.route('/vendor/:vendorId/bills-with-payments').get( isAuthencated, getVendorBillsWithPayments)
router.route('/vendors-with-all-bills-payment').get(isAuthencated, getAllVendorsWithAllBillsPayment);



module.exports=router