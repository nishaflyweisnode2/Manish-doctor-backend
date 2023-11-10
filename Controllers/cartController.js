const Cart = require('../Models/cartModel');
const Product = require('../Models/productModel');
const userModel = require('../Models/usersAuthModel');
const { StatusCodes } = require('http-status-codes');
const Coupon = require('../Models/couponModel');



module.exports.addToCart1 = async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        const data = await userModel.findOne({ id: req.user.id });
        console.log(data);

        if (!data) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'Failed',
                message: 'User not found.',
            });
        }

        if (!productId || !quantity) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'Failed',
                message: 'Required fields are missing.',
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'Failed',
                message: 'Product not found.',
            });
        }

        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            cart = new Cart({
                user: req.user.id,
                items: [],
            });
        }

        const existingCartItem = cart.items.find((item) => item.product.toString() === productId);

        if (existingCartItem) {
            existingCartItem.quantity += quantity;
            existingCartItem.price = product.price * existingCartItem.quantity;
        } else {
            const newCartItem = {
                product: productId,
                quantity: quantity,
                price: product.price * quantity,
            };
            cart.items.push(newCartItem);
        }

        const savedCart = await cart.save();

        if (savedCart) {
            return res.status(StatusCodes.CREATED).json({
                status: 'Success',
                message: 'Product added to the cart',
                data: savedCart,
            });
        } else {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: 'Failed',
                message: 'Failed to add the product to the cart.',
            });
        }
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: 'An error occurred while adding the product to the cart.',
            error: error.message,
        });
    }
};


module.exports.addToCart = async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        const user = await userModel.findOne({ id: req.user.id });

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'Failed',
                message: 'User not found.',
            });
        }

        if (!productId || !quantity) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'Failed',
                message: 'Required fields are missing.',
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'Failed',
                message: 'Product not found.',
            });
        }

        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            cart = new Cart({
                user: req.user.id,
                items: [],
            });
        }

        const existingCartItem = cart.items.find((item) => item.product.toString() === productId);

        if (existingCartItem) {
            existingCartItem.quantity += quantity;
            existingCartItem.price = product.price * existingCartItem.quantity;
            existingCartItem.discountAmount = 0;
        } else {
            const newCartItem = {
                product: productId,
                quantity: quantity,
                price: product.price * quantity,
                discountAmount: 0
            };
            cart.items.push(newCartItem);
        }

        let totalAmount = cart.items.reduce((total, item) => total + item.price, 0);

        if (totalAmount < 500) {
            cart.deliveryCharge = 50;
        } else if (totalAmount < 1000) {
            cart.deliveryCharge = 20;
        } else if (totalAmount >= 1000 && totalAmount < 1600) {
            cart.deliveryCharge = 10;
        } else {
            cart.deliveryCharge = 0;
        }

        totalAmount += cart.deliveryCharge;
        cart.totalAmount = totalAmount;

        const savedCart = await cart.save();

        if (savedCart) {
            return res.status(StatusCodes.CREATED).json({
                status: 'Success',
                message: 'Product added to the cart',
                data: savedCart,
            });
        } else {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: 'Failed',
                message: 'Failed to add the product to the cart.',
            });
        }
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: 'An error occurred while adding the product to the cart.',
            error: error.message,
        });
    }
};


module.exports.getUserCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ user: userId }).populate('items.product');

        if (!cart) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'Failed',
                message: 'Cart not found.',
            });
        }

        return res.status(StatusCodes.OK).json({
            status: 'Success',
            message: "User's cart retrieved successfully.",
            data: cart,
        });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: 'An error occurred while retrieving the user\'s cart.',
            error: error.message,
        });
    }
};


module.exports.updateCartItemQuantity = async (req, res) => {
    const { itemId, quantity } = req.body;

    try {
        const userId = req.user.id;

        if (quantity < 1) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'Failed',
                message: 'Quantity must be at least 1.',
            });
        }

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'Failed',
                message: 'Cart not found.',
            });
        }

        const cartItem = cart.items.id(itemId);

        if (!cartItem) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'Failed',
                message: 'Cart item not found.',
            });
        }

        const product = await Product.findById(cartItem.product);

        if (!product) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'Failed',
                message: 'Product not found.',
            });
        }

        const price = product.price * quantity;

        cartItem.quantity = quantity;
        cartItem.price = price;

        let totalAmount = cart.items.reduce((total, item) => total + item.price, 0);

        if (cart.isCoupon) {
            const coupon = await Coupon.findOne({ code: cart.couponCode });

            if (coupon) {
                const couponDiscount = coupon.isPercent
                    ? (totalAmount * coupon.discount) / 100
                    : coupon.discount;

                totalAmount -= couponDiscount;

                cart.discountAmount = couponDiscount;
            } else {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: 'Failed',
                    message: 'Invalid coupon code.',
                });
            }
        } else {
            cart.discountAmount = 0;
        }

        if (totalAmount < 500) {
            cart.deliveryCharge = 50;
        } else if (totalAmount < 1000) {
            cart.deliveryCharge = 20;
        } else if (totalAmount >= 1000 && totalAmount < 1600) {
            cart.deliveryCharge = 10;
        } else {
            cart.deliveryCharge = 0;
        }

        totalAmount += cart.deliveryCharge;
        cart.totalAmount = totalAmount;

        const savedCart = await cart.save();

        return res.status(StatusCodes.OK).json({
            status: 'Success',
            message: 'Cart item quantity updated successfully.',
            data: savedCart,
        });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: 'An error occurred while updating the cart item quantity.',
            error: error.message,
        });
    }
};


module.exports.removeCartItem = async (req, res) => {
    const { itemId } = req.body;

    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'Failed',
                message: 'Cart not found.',
            });
        }

        const cartItem = cart.items.id(itemId);

        if (!cartItem) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'Failed',
                message: 'Cart item not found.',
            });
        }

        // Remove the cart item
        cartItem.remove();

        const savedCart = await cart.save();

        return res.status(StatusCodes.OK).json({
            status: 'Success',
            message: 'Cart item removed successfully.',
            data: savedCart,
        });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: 'An error occurred while removing the cart item.',
            error: error.message,
        });
    }
};


module.exports.applyCoupon = async (req, res) => {
    try {
        const userId = req.user.id;
        const { couponCode } = req.body;

        const userCart = await Cart.findOne({ user: userId });

        if (!userCart) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'Failed',
                message: 'User cart not found.',
            });
        }

        let totalAmount = userCart.items.reduce((total, item) => total + item.price, 0);
        let discountAmount = 0;

        if (couponCode) {
            const coupon = await Coupon.findOne({ code: couponCode });

            if (!coupon) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: 'Failed',
                    message: 'Invalid coupon code.',
                });
            }

            if (!coupon.isActive) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: 'Failed',
                    message: 'Coupon is not active.',
                });
            }

            if (coupon.expirationDate && new Date() > coupon.expirationDate) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: 'Failed',
                    message: 'Coupon has expired.',
                });
            }

            discountAmount = coupon.isPercent
                ? (totalAmount * coupon.discount) / 100
                : coupon.discount;

            totalAmount -= discountAmount;

            userCart.couponCode = couponCode;
            userCart.isCoupon = true;
            userCart.discountAmount = discountAmount;
        } else {
            userCart.couponCode = null;
            userCart.isCoupon = false;
            userCart.discountAmount = 0;
        }

        if (totalAmount < 500) {
            userCart.deliveryCharge = 50;
        } else if (totalAmount < 1000) {
            userCart.deliveryCharge = 20;
        } else if (totalAmount >= 1000 && totalAmount < 1600) {
            userCart.deliveryCharge = 10;
        } else {
            userCart.deliveryCharge = 0;
        }

        totalAmount += userCart.deliveryCharge;

        userCart.totalAmount = totalAmount;

        const updatedCart = await userCart.save();

        return res.status(StatusCodes.OK).json({
            status: 'Success',
            message: 'Coupon applied successfully.',
            data: {
                cart: updatedCart,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: 'An error occurred while applying the coupon.',
            error: error.message,
        });
    }
};


module.exports.removeCoupon = async (req, res) => {
    try {
        const userId = req.user.id;

        const userCart = await Cart.findOne({ user: userId });

        if (!userCart) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'Failed',
                message: 'User cart not found.',
            });
        }

        userCart.couponCode = null;
        userCart.isCoupon = false;
        userCart.discountAmount = 0;

        let totalAmount = userCart.items.reduce((total, item) => total + item.price, 0);

        if (totalAmount < 500) {
            userCart.deliveryCharge = 50;
        } else if (totalAmount < 1000) {
            userCart.deliveryCharge = 20;
        } else if (totalAmount >= 1000 && totalAmount < 1600) {
            userCart.deliveryCharge = 10;
        } else {
            userCart.deliveryCharge = 0;
        }

        totalAmount += userCart.deliveryCharge;

        userCart.totalAmount = totalAmount;

        const updatedCart = await userCart.save();

        return res.status(StatusCodes.OK).json({
            status: 'Success',
            message: 'Coupon removed successfully.',
            data: updatedCart,
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: 'An error occurred while removing the coupon.',
            error: error.message,
        });
    }
};




