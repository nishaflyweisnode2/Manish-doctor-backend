const Coupon = require('../Models/couponModel');
const Cart = require('../Models/cartModel');
const { StatusCodes } = require('http-status-codes');



exports.createCoupon = async (req, res) => {
    try {
        const { code, discount, isPercent, expirationDate } = req.body;

        if (!code || !discount || !isPercent || !expirationDate) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'Failed',
                message: 'Required fields are missing.',
            });
        }

        const checkCoupon = await Coupon.findOne({ code })
        if (checkCoupon) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'Failed',
                message: 'coupon code already exist.',
            });
        }
        const coupon = new Coupon({
            code,
            discount,
            isPercent,
            expirationDate,
        });

        await coupon.save();

        return res.status(StatusCodes.CREATED).json({
            status: 'Success',
            message: 'Coupon created successfully',
            data: coupon,
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: 'Error creating coupon',
            error: error.message,
        });
    }
};


exports.getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find();

        return res.status(StatusCodes.OK).json({
            status: 'Success',
            message: 'Coupons retrieved successfully',
            data: coupons,
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: 'Error retrieving coupons',
            error: error.message,
        });
    }
};


exports.getCouponByCode = async (req, res) => {
    try {
        const couponCode = req.params.id;
        const coupon = await Coupon.findOne({ _id: couponCode });

        if (!coupon) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'Failed',
                message: 'Coupon not found.',
            });
        }

        return res.status(StatusCodes.OK).json({
            status: 'Success',
            message: 'Coupon retrieved successfully',
            data: coupon,
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: 'Error retrieving coupon',
            error: error.message,
        });
    }
};


exports.updateCoupon = async (req, res) => {
    try {
        const couponCode = req.params.id;
        const { discount, isPercent, expirationDate } = req.body;

        const coupon = await Coupon.findOne({ _id: couponCode });

        if (!coupon) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'Failed',
                message: 'Coupon not found.',
            });
        }

        if (discount !== undefined) {
            coupon.discount = discount;
        }

        if (isPercent !== undefined) {
            coupon.isPercent = isPercent;
        }

        if (expirationDate !== undefined) {
            coupon.expirationDate = expirationDate;
        }

        await coupon.save();

        return res.status(StatusCodes.OK).json({
            status: 'Success',
            message: 'Coupon updated successfully',
            data: coupon,
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: 'Error updating coupon',
            error: error.message,
        });
    }
};




exports.deleteCoupon = async (req, res) => {
    try {
        const couponCode = req.params.id;
        const coupon = await Coupon.findOne({ _id: couponCode });

        if (!coupon) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'Failed',
                message: 'Coupon not found.',
            });
        }

        await coupon.delete();

        return res.status(StatusCodes.OK).json({
            status: 'Success',
            message: 'Coupon deleted successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: 'Error deleting coupon',
            error: error.message,
        });
    }
};
