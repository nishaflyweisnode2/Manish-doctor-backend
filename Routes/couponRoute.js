const express = require('express');
const router = express.Router();
const CouponController = require('../Controllers/couponController');

const { verifyToken, verifyTokenwithAuthorization, verifyTokenwithAdmin } = require("../Middlewares/verifyToken");


router.post('/coupons', verifyToken, CouponController.createCoupon);
router.get('/coupons', verifyToken, CouponController.getAllCoupons);
router.get('/coupons/:id', verifyToken, CouponController.getCouponByCode);
router.put('/coupons/:id', verifyToken, CouponController.updateCoupon);
router.delete('/coupons/:id', verifyToken, CouponController.deleteCoupon);

module.exports = router;

