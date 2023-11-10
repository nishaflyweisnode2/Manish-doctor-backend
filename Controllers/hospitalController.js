const Hospital = require('../Models/hospitalModel');
const { StatusCodes } = require("http-status-codes");
const cloudinary = require("../utils/cloudinary")


exports.createHospital = async (req, res) => {
    try {
        const { name, address, pincode, description, facilities } = req.body;


        if (!name || !address || !pincode || !description || !facilities || !Array.isArray(facilities) || facilities.length === 0) {
            return res.status(400).json({
                status: 400,
                message: 'Required fields are missing or invalid.',
            });
        }

        const result = await cloudinary.uploader.upload(req.file.path)

        const newHospital = new Hospital({
            image: result.secure_url,
            cloudinary_id: result.public_id,
            name,
            address,
            pincode,
            description,
            facilities,
        });


        const savedHospital = await newHospital.save();


        return res.status(201).json({
            status: 201,
            message: 'Hospital created successfully.',
            data: savedHospital,
        });
    } catch (error) {

        console.error(error);
        return res.status(500).json({
            status: 500,
            message: 'Error creating hospital.',
            error: error.message,
        });
    }
};

exports.getAllHospital = async (req, res) => {
    try {

        const hospital = await Hospital.find();

        if (!hospital) {

            return res.status(404).json({
                status: 404,
                message: 'Hospital not found.',
            });
        }


        return res.status(200).json({
            status: 200,
            message: 'Hospital details retrieved successfully.',
            data: hospital,
        });
    } catch (error) {

        console.error(error);
        return res.status(500).json({
            status: 500,
            message: 'Error retrieving hospital details.',
            error: error.message,
        });
    }
};

exports.getHospital = async (req, res) => {
    try {
        const hospitalId = req.params.id;

        const hospital = await Hospital.findById(hospitalId);

        if (!hospital) {

            return res.status(404).json({
                status: 404,
                message: 'Hospital not found.',
            });
        }


        return res.status(200).json({
            status: 200,
            message: 'Hospital details retrieved successfully.',
            data: hospital,
        });
    } catch (error) {

        console.error(error);
        return res.status(500).json({
            status: 500,
            message: 'Error retrieving hospital details.',
            error: error.message,
        });
    }
};


exports.updateHospital = async (req, res) => {
    try {
        const hospitalId = req.params.id;
        const updateFields = {};

        if (req.file) {
            const hospital = await Hospital.findById(hospitalId);
            if (!hospital) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    status: 'Failed',
                    message: 'Hospital not found.',
                });
            }

            if (hospital.cloudinary_id) {
                await cloudinary.uploader.destroy(hospital.cloudinary_id);
            }

            const result = await cloudinary.uploader.upload(req.file.path);

            updateFields.image = result.secure_url;
            updateFields.cloudinary_id = result.public_id;
        }

        if (req.body.name) {
            updateFields.name = req.body.name;
        }
        if (req.body.address) {
            updateFields.address = req.body.address;
        }
        if (req.body.pincode) {
            updateFields.pincode = req.body.pincode;
        }
        if (req.body.description) {
            updateFields.description = req.body.description;
        }
        if (req.body.facilities && Array.isArray(req.body.facilities)) {
            updateFields.facilities = req.body.facilities;
        }

        if (Object.keys(updateFields).length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'Failed',
                message: 'No valid fields to update.',
            });
        }

        const updatedHospital = await Hospital.findByIdAndUpdate(hospitalId, updateFields, { new: true });

        if (!updatedHospital) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'Failed',
                message: 'Hospital not found.',
            });
        }

        return res.status(StatusCodes.OK).json({
            status: 'Success',
            message: 'Hospital updated successfully.',
            data: updatedHospital,
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: 'Error updating hospital.',
            error: error.message,
        });
    }
};


exports.deleteHospital = async (req, res) => {
    try {
        const hospitalId = req.params.id;

        const hospital = await Hospital.findByIdAndRemove(hospitalId);

        if (!hospital) {

            return res.status(404).json({
                status: 404,
                message: 'Hospital not found.',
            });
        }


        return res.status(200).json({
            status: 200,
            message: 'Hospital deleted successfully.',
        });
    } catch (error) {

        console.error(error);
        return res.status(500).json({
            status: 500,
            message: 'Error deleting hospital.',
            error: error.message,
        });
    }
};
