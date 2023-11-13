const { StatusCodes } = require("http-status-codes");
const { Doctor } = require("../Models/doctorModel");
const cloudinary = require("../utils/cloudinary")
const Availability = require('../Models/slotAvailabilityModel');




exports.addDoctor = async (req, res) => {
    try {
        const {
            doctorname,
            yearexperience,
            content,
            phonenumber,
            email,
            latitude,
            longitude,
            fee,
        } = req.body;

        if (!doctorname || !yearexperience || !content || !phonenumber || !email) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'Failed',
                message: 'Required fields are missing or empty.',
            });
        }

        const existingDoctor = await Doctor.findOne({ doctorname });

        if (existingDoctor) {
            return res.status(StatusCodes.CONFLICT).json({
                status: 'Failed',
                message: 'Doctor already exists.',
            });
        }

        const result = await cloudinary.uploader.upload(req.file.path);

        const newDoctor = new Doctor({
            doctorspicture: result.secure_url,
            doctorname,
            yearexperience,
            rating: req.body.rating || 0,
            content,
            phonenumber,
            email,
            cloudinary_id: result.public_id,
            location: {
                coordinates: [longitude, latitude],
            },
            fee,
            treatmentCount: req.body.treatmentCount || 0,
        });

        await newDoctor.save();

        return res.status(StatusCodes.CREATED).json({
            status: 'Success',
            message: 'Doctor added successfully.',
            data: newDoctor,
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: 'Oops!!! Error occurs.',
            error: error.message,
        });
    }
};


exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find().populate('availability');
        return res.status(StatusCodes.OK).json({
            status: 'Success',
            message: 'Doctors retrieved successfully.',
            data: doctors,
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: 'Error retrieving doctors.',
            error: error.message,
        });
    }
};


exports.getDoctorById = async (req, res) => {
    const doctorId = req.params.id;
    try {
        const doctor = await Doctor.findById(doctorId).populate('availability');
        if (!doctor) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'Failed',
                message: 'Doctor not found.',
            });
        }
        return res.status(StatusCodes.OK).json({
            status: 'Success',
            message: 'Doctor retrieved successfully.',
            data: doctor,
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: 'Error retrieving doctor.',
            error: error.message,
        });
    }
};


exports.updateDoctorById = async (req, res) => {

    try {
        let updateid = await Doctor.findById(req.params.id);

        if (updateid) {
            await cloudinary.uploader.destroy(updateid.cloudinary_id);
            const result = await cloudinary.uploader.upload(req.file.path);
            const data = {

                doctorspicture: result.secure_url || updateid.doctorspicture,
                doctorname: req.body.doctorname || updateid.doctorname,
                yearexperience: req.body.yearexperience || updateid.yearexperience,
                rating: req.body.rating || updateid.rating,
                content: req.body.content || updateid.content,
                phonenumber: req.body.phonenumber || updateid.phonenumber,
                email: req.body.email || updateid.email,
                latitude: req.body.latitude || updateid.latitude,
                longitude: req.body.longitude || updateid.longitude,
                fee: req.body.fee || updateid.fee,
                cloudinary_id: result.public_id || updateid.cloudinary_id
            };
            Doctorsdetails = await Doctor.findByIdAndUpdate(req.params.id, data, { new: true })
            res.status(StatusCodes.OK).json({
                message: "Doctor updated successfuly",
                code: StatusCodes.OK,
                data: Doctorsdetails
            })
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({
                code: StatusCodes.BAD_REQUEST,
                status: "failed",
                message: "Invalid Doctor ID",
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}


exports.deleteDoctorById = async (req, res) => {
    const doctorId = req.params.id;
    try {
        const deletedDoctor = await Doctor.findByIdAndDelete(doctorId);
        if (!deletedDoctor) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'Failed',
                message: 'Doctor not found.',
            });
        }
        return res.status(StatusCodes.OK).json({
            status: 'Success',
            message: 'Doctor deleted successfully.',
            data: deletedDoctor,
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: 'Error deleting doctor.',
            error: error.message,
        });
    }
};


exports.updateDoctorAvailability = async (req, res) => {
    try {
        const doctorId = req.params.doctorId;
        const { maxPatients, startTime, endTime } = req.body;

        const doctor = await Doctor.findById(doctorId);

        if (!doctor) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Doctor not found',
            });
        }

        let availability = await Availability.findOne({ doctor: doctorId, maxPatients });

        if (!availability) {
            availability = new Availability({ doctor: doctorId, maxPatients });
        }

        await Doctor.findByIdAndUpdate(doctorId, { availability: availability._id });

        const existingSlot = availability.slots.find(slot =>
            slot.startTime === startTime && slot.endTime === endTime
        );

        if (existingSlot) {
            return res.status(400).json({
                status: 'Failed',
                message: 'Slot already exists for the specified time',
            });
        }

        availability.slots.push({
            startTime,
            endTime,
            maxPatients
        });

        await availability.save();

        return res.status(200).json({
            status: 'Success',
            message: 'Slot added to doctor availability',
            data: availability,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'Failed',
            message: 'Error adding slot to doctor availability',
            error: error.message,
        });
    }
};


exports.updateNumberOfPatients = async (req, res) => {
    try {
        const doctorId = req.params.doctorId;
        const { slotId, maxPatients } = req.body;

        const doctorAvailability = await Availability.findOne({ doctor: doctorId });

        if (!doctorAvailability) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Doctor not found in Availability',
            });
        }

        console.log("1", doctorAvailability.slots);

        const foundSlot = doctorAvailability.slots.find(slot => slot._id.toString() === slotId);

        console.log("2", foundSlot);

        console.log("3", doctorAvailability._id);

        if (!foundSlot) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Slot not found for the specified ID',
            });
        }

        foundSlot.maxPatients = maxPatients;
        await doctorAvailability.save();

        return res.status(200).json({
            status: 'Success',
            message: 'Number of patients updated for the slot',
            data: doctorAvailability,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'Failed',
            message: 'Error updating the number of patients for the slot',
            error: error.message,
        });
    }
};


exports.deleteDoctorSlot = async (req, res) => {
    try {
        const doctorId = req.params.doctorId;
        const slotId = req.params.slotId;

        const doctor = await Doctor.findById(doctorId);

        if (!doctor) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Doctor not found',
            });
        }

        const availability = await Availability.findOne({
            doctor: doctorId,
        });

        if (!availability) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Availability not found for the specified doctor',
            });
        }

        const slotIndex = availability.slots.findIndex((slot) => slot._id.toString() === slotId);

        if (slotIndex === -1) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Slot not found for the specified slotId',
            });
        }

        availability.slots.splice(slotIndex, 1);

        await availability.save();

        return res.status(200).json({
            status: 'Success',
            message: 'Slot deleted from doctor availability',
            data: availability,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'Failed',
            message: 'Error deleting slot from doctor availability',
            error: error.message,
        });
    }
};











