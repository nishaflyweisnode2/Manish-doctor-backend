const express = require('express');
const router = express.Router();
const cartController = require('../Controllers/cartController');

const { verifyToken, verifyTokenwithAuthorization, verifyTokenwithAdmin } = require("../Middlewares/verifyToken");


router.post('/cart/add', verifyToken, cartController.addToCart);
router.get('/cart', verifyToken, cartController.getUserCart);
router.put('/cart/update', verifyToken, cartController.updateCartItemQuantity);
router.delete('/cart/remove', verifyToken, cartController.removeCartItem);



module.exports = router;
