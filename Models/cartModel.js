const mongoose = require('mongoose');

const CartItemSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    quantity: {
        type: Number,
        min: 1,
    },
    price: {
        type: Number,
    },
});

const CartSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    items: [CartItemSchema],
    couponCode: {
        type: String,
    },
    discountAmount: {
        type: Number,
        default: 0
    },
    isCoupon: {
        type: Boolean,
        default: false,
    },
    deliveryCharge: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
    },
});

module.exports = mongoose.model('Cart', CartSchema);
