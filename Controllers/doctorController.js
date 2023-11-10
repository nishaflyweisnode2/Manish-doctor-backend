const { StatusCodes } = require("http-status-codes");
const { Doctor } = require("../Models/doctorModel");
const cloudinary = require("../utils/cloudinary")




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
        const doctors = await Doctor.find();
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
        const doctor = await Doctor.findById(doctorId);
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



exports.updateDoctorAvailability = async (doctorId, appointmentDate, bookedSlot) => {
    try {
        const doctor = await Doctor.findById(doctorId);

        if (!doctor) {
            return { success: false, message: 'Doctor not found' };
        }

        const availabilityForDate = doctor.availability.find(avail => avail.date.toDateString() === new Date(appointmentDate).toDateString());

        if (availabilityForDate) {
            availabilityForDate.slots = availabilityForDate.slots.filter(slot => slot !== bookedSlot);
            await doctor.save();
            return { success: true, message: 'Doctor availability updated' };
        }

        return { success: false, message: 'Availability not found for the specified date' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error updating doctor availability' };
    }
};

