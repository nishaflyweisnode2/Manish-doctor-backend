const express = require('express');
const router = express.Router();
const paymentController = require('../Controllers/paymentController');

const { verifyToken, verifyTokenwithAuthorization, verifyTokenwithAdmin } = require("../Middlewares/verifyToken");



router.post('/payments', verifyToken, paymentController.createPayment);
router.get('/payments', verifyToken, paymentController.getUserPayments);
router.get('/payments/:id', verifyToken, paymentController.getPaymentDetails);
router.delete('/payments/:id', verifyToken, paymentController.deletePayment);
router.put('/payments/:id', verifyToken, paymentController.updatePaymentStatus);



module.exports = router;
