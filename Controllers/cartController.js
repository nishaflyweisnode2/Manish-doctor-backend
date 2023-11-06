const Cart = require('../Models/cartModel');
const Product = require('../Models/productModel');
const userModel = require('../Models/usersAuthModel');
const { StatusCodes } = require('http-status-codes');



module.exports.addToCart = async (req, res) => {
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

        // Calculate the new price based on the updated quantity
        const price = product.price * quantity;

        // Update the cart item's quantity and price
        cartItem.quantity = quantity;
        cartItem.price = price;

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

