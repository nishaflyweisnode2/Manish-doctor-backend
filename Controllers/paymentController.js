const Payment = require('../Models/paymentModel');
const Cart = require('../Models/cartModel');
const { StatusCodes } = require('http-status-codes');




exports.createPayment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { paymentMethod } = req.body;

        if (!paymentMethod) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'Failed',
                message: 'Required fields are missing.',
            });
        }

        const userCart = await Cart.findOne({ user: userId });

        if (!userCart) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'Failed',
                message: 'User cart not found.',
            });
        }

        let amount = 0;
        for (const item of userCart.items) {
            amount += item.price;
        }

        const payment = new Payment({
            user: userId,
            cart: userCart._id,
            amount,
            paymentMethod,
        });

        await payment.save();

        await Cart.findByIdAndRemove(userCart._id);

        return res.status(StatusCodes.CREATED).json({
            status: 'Success',
            message: 'Payment record created successfully, and user cart removed',
            data: payment,
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: 'Error creating payment record',
            error: error.message,
        });
    }
};



exports.getUserPayments = async (req, res) => {
    try {
        const userId = req.user.id;

        const payments = await Payment.find({ user: userId });

        return res.status(StatusCodes.OK).json({
            status: 'Success',
            message: 'User payments retrieved successfully',
            data: payments,
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: 'Error retrieving user payments',
            error: error.message,
        });
    }
};


exports.getPaymentDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const paymentId = req.params.id;

        const payment = await Payment.findOne({ user: userId, _id: paymentId });

        if (!payment) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'Failed',
                message: 'Payment not found.',
            });
        }

        return res.status(StatusCodes.OK).json({
            status: 'Success',
            message: 'Payment details retrieved successfully',
            data: payment,
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: 'Error retrieving payment details',
            error: error.message,
        });
    }
};


exports.deletePayment = async (req, res) => {
    try {
        const userId = req.user.id;
        const paymentId = req.params.id;

        const payment = await Payment.findOne({ user: userId, _id: paymentId });

        if (!payment) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'Failed',
                message: 'Payment not found.',
            });
        }

        await payment.remove();

        return res.status(StatusCodes.OK).json({
            status: 'Success',
            message: 'Payment deleted successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: 'Error deleting payment',
            error: error.message,
        });
    }
};


exports.updatePaymentStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const paymentId = req.params.id;
        const { status } = req.body;

        if (!status) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'Failed',
                message: 'Required fields are missing.',
            });
        }

        const payment = await Payment.findOne({ user: userId, _id: paymentId });

        if (!payment) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'Failed',
                message: 'Payment not found.',
            });
        }

        payment.status = status;

        await payment.save();

        return res.status(StatusCodes.OK).json({
            status: 'Success',
            message: 'Payment updated successfully',
            data: payment,
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: 'Error updating payment',
            error: error.message,
        });
    }
};


