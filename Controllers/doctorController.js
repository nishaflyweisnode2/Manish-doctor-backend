const { StatusCodes } = require("http-status-codes");
const { Doctor } = require("../Models/doctorModel");
const cloudinary = require("../utils/cloudinary")
const Availability = require('../Models/slotAvailabilityModel');
const Appointment = require('../Models/appointmentModel');
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");



const generateOTP = () => {
    const otp = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    return otp.toString();
};


exports.SignUpUser = async (req, res) => {
    try {

        const { phonenumber } = req.body;
        if (!phonenumber) {
            return res.status(400).json("phonenumber is required");
        }

        const findUser = await Doctor.findOne({ phonenumber });
        if (findUser) {
            return res.status(409).json({ status: 409, message: "phone number already in use" });
        }

        const otp = generateOTP();
        const newUser = await Doctor.create({ phonenumber, otp });
        await newUser.save();

        // const welcomeMessage = `Welcome, ${newUser.phonenumber}! Thank you for registering.`;
        // const welcomeNotification = new Notification({
        //     recipient: newUser._id,
        //     content: welcomeMessage,
        //     type: 'welcome',
        // });
        // await welcomeNotification.save();

        const accessToken = jwt.sign({
            id: newUser.id,
            phonenumber: req.body.phonenumber
        }, process.env.SECRETK, { expiresIn: "365d" });
        res.status(201).json({
            message: "User created successfully",
            token: accessToken,
            data: newUser,
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};


exports.verifyOTP = async (req, res) => {
    try {
        const user = await Doctor.findById(req.params.id);
        if (!user) {
            return res.status(404).send({ status: 404, message: "User are not found" });
        }

        if (user.otp != req.body.otp) {
            return res.status(400).send({ status: 400, message: "Invalid OTP" });
        }
        const accessToken = jwt.sign({
            id: user.id,
            phonenumber: req.body.phonenumber
        }, process.env.SECRETK, { expiresIn: "365d" });

        return res.status(200).json({
            message: "OTP Verify Successfully",
            token: accessToken,
            data: user
        })

    } catch (error) {
        console.log(error.message);
        res.status(400).send({ error: error.message });
    }
};


exports.resendOTP = async (req, res) => {
    try {
        const { phonenumber } = req.body;
        const user = await Doctor.findOne({ phonenumber: phonenumber });
        if (!user) {
            return res.status(404).send({ status: 404, message: "User not found" });
        }
        const otp = generateOTP();
        const otpExpiration = new Date(Date.now() + 5 * 60 * 1000);
        const updated = await Doctor.findOneAndUpdate(
            { _id: user._id },
            { otp, otpExpiration, },
            { new: true }
        );
        let obj = {
            id: updated._id,
            otp: updated.otp,
            phonenumber: updated.phonenumber,
        };
        res.status(200).send({ status: 200, message: "OTP resent", data: obj });
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .send({ status: 500, message: "Server error" + error.message });
    }
};


exports.addDoctorByAdmin = async (req, res) => {
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


exports.adminGetAllDoctors = async (req, res) => {
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


exports.adminGetDoctorById = async (req, res) => {
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


exports.adminDeleteDoctorById = async (req, res) => {
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


exports.registration1 = async (req, res) => {
    try {
        const doctorId = req.params.doctorId;
        const {
            doctorname,
            dateOfBirth,
            registrationNumber,
            specialityId,
            yearexperience,
        } = req.body;

        if (!doctorname || !dateOfBirth || !registrationNumber || !specialityId || !yearexperience) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'Failed',
                message: 'Required fields are missing or empty.',
            });
        }

        // const existingDoctor = await Doctor.findOne({ doctorname });

        // if (existingDoctor) {
        //     return res.status(StatusCodes.CONFLICT).json({
        //         status: 'Failed',
        //         message: 'Doctor already exists.',
        //     });
        // }

        const existingDoctorID = await Doctor.findById(doctorId);

        if (!existingDoctorID) {
            return res.status(StatusCodes.CONFLICT).json({
                status: 'Failed',
                message: 'DoctorId not exists.',
            });
        }

        const result = await cloudinary.uploader.upload(req.file.path);

        existingDoctorID.doctorspicture = result.secure_url;
        existingDoctorID.cloudinary_id = result.public_id;
        existingDoctorID.doctorname = doctorname;
        existingDoctorID.dateOfBirth = dateOfBirth;
        existingDoctorID.registrationNumber = registrationNumber;
        existingDoctorID.specialityId = specialityId;
        existingDoctorID.yearexperience = yearexperience;

        await existingDoctorID.save();

        return res.status(StatusCodes.CREATED).json({
            status: 'Success',
            message: 'Doctor details updated successfully.',
            data: existingDoctorID,
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


exports.registration2 = async (req, res) => {
    try {
        const findDocument = await Doctor.findById({ _id: req.params.id });
        if (!findDocument) {
            return res.status(404).json({ status: 404, message: "Data not found." });
        }

        findDocument.doctorspicture = req.files['doctorspicture'][0].path || findDocument.doctorspicture;
        findDocument.idProof = req.files['idProof'][0].path || findDocument.idProof;
        findDocument.digitalSignature = req.files['digitalSignature'][0].path || findDocument.digitalSignature;
        findDocument.clinicPhoto = req.files['clinicPhoto'][0].path || findDocument.clinicPhoto;
        findDocument.letterHead = req.files['letterHead'][0].path || findDocument.letterHead;
        findDocument.registrationCertificate = req.files['registrationCertificate'][0].path || findDocument.registrationCertificate;
        findDocument.medicalDegrees = req.files['medicalDegrees'][0].path || findDocument.medicalDegrees;

        const updated = await findDocument.save();
        return res.status(200).json({ message: "Updated", data: updated });
    } catch (error) {
        console.error("An error occurred:", error);
        return res.status(500).json({
            message: "An error occurred. Please try again later.",
            error: error.message,
        });
    }
};


exports.updateProfile = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const { email, doctorname, age, weight, height } = req.body;

        if (!mongoose.Types.ObjectId.isValid(doctorId)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: StatusCodes.BAD_REQUEST, message: "Invalid user or doctor ID" });
        }

        let updatedProfile;

        let doctor = await Doctor.findById(doctorId);

        if (!doctor) {
            return res.status(StatusCodes.NOT_FOUND).json({ status: StatusCodes.NOT_FOUND, message: "User or doctor not found" });
        }

        if (req.file) {
            doctor.doctorspicture = req.file.path
        } else {
            doctor.doctorspicture = doctor.doctorspicture
        }
        doctor.email = email || doctor.email;
        doctor.doctorname = doctorname || doctor.doctorname;
        doctor.age = age || doctor.age;
        doctor.weight = weight || doctor.weight;
        doctor.height = height || doctor.height;

        updatedProfile = await doctor.save();

        res.status(StatusCodes.OK).json({
            message: "Profile updated successfully",
            data: updatedProfile,
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: error.message,
        });
    }
};


exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find();
        return res.status(StatusCodes.OK).json({
            status: 'Success',
            data: doctors,
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


exports.getDoctorById = async (req, res) => {
    try {
        const doctorId = req.params.doctorId;
        const doctor = await Doctor.findById(doctorId);

        if (!doctor) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'Failed',
                message: 'Doctor not found.',
            });
        }

        return res.status(StatusCodes.OK).json({
            status: 'Success',
            data: doctor,
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


exports.deleteDoctor = async (req, res) => {
    try {
        const doctorId = req.params.doctorId;
        const doctor = await Doctor.findByIdAndDelete(doctorId);

        if (!doctor) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'Failed',
                message: 'Doctor not found.',
            });
        }

        return res.status(StatusCodes.OK).json({
            status: 'Success',
            message: 'Doctor deleted successfully.',
            data: doctor,
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


exports.getDoctorAppointment = async (req, res) => {
    try {
        const doctorId = req.params.doctorId;

        if (!doctorId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'Failed',
                message: 'Doctor ID is required.',
            });
        }

        const appointments = await Appointment.find({ 'doctor': doctorId })
            .populate('user', 'firstname lastname userspicture')
            .populate('avilableTime')
            .exec();

        return res.status(StatusCodes.OK).json({
            status: 'Success',
            message: 'Appointments retrieved successfully.',
            data: appointments,
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


exports.getPatientsByDoctorId = async (req, res) => {
    try {
        const doctorId = req.params.doctorId;

        if (!doctorId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'Failed',
                message: 'Doctor ID is required.',
            });
        }

        const appointments = await Appointment.find({ 'doctor': doctorId })
            .populate('user', 'firstname lastname userspicture')
            .populate('avilableTime')
            .exec();

        const patients = appointments.map(appointment => ({
            userId: appointment.user._id,
            userName: `${appointment.user.firstname} ${appointment.user.lastname}`,
            userPicture: appointment.user.userspicture,
            appointmentDate: appointment.appointmentDate,
            slot: appointment.slot,
            appointmentType: appointment.appointmentType,
            startTime: appointment.startTime,
            endTime: appointment.endTime,
            // Add more fields if needed
        }));

        return res.status(StatusCodes.OK).json({
            status: 'Success',
            message: 'Patients retrieved successfully.',
            data: patients,
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



exports.addRatingAndReview = async (req, res) => {
    try {
        const doctorId = req.params.doctorId;
        const { rating, review } = req.body;
        const userId = req.user.id;

        if (!doctorId || !rating || !review || !userId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'Failed',
                message: 'Required fields are missing or empty.',
            });
        }

        const doctor = await Doctor.findById(doctorId);

        if (!doctor) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'Failed',
                message: 'Doctor not found.',
            });
        }

        doctor.ratings.push({
            rating,
            review,
            user: userId,
        });

        const totalRatings = doctor.ratings.length;
        const sumRatings = doctor.ratings.reduce((sum, r) => sum + r.rating, 0);
        doctor.rating = sumRatings / totalRatings;

        await doctor.save();

        return res.status(StatusCodes.CREATED).json({
            status: 'Success',
            message: 'Rating and review added successfully.',
            data: doctor.ratings[totalRatings - 1],
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



exports.getDoctorRatings = async (req, res) => {
    try {
        const doctorId = req.params.doctorId;

        if (!doctorId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'Failed',
                message: 'Doctor ID is required.',
            });
        }

        const doctor = await Doctor.findById(doctorId);

        if (!doctor) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'Failed',
                message: 'Doctor not found.',
            });
        }

        return res.status(StatusCodes.OK).json({
            status: 'Success',
            data: {
                averageRating: doctor.rating,
                ratings: doctor.ratings,
            },
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



exports.updateReview = async (req, res) => {
    try {
        const userId = req.user.id;
        const { doctorId, reviewId } = req.params;
        const { rating, review } = req.body;

        const doctor = await Doctor.findById(doctorId);

        if (!doctor) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Doctor not found',
            });
        }

        if (!doctor.ratings || !Array.isArray(doctor.ratings)) {
            return res.status(404).json({
                status: 'Failed',
                message: 'ratings not found or invalid format',
            });
        }

        const reviewToUpdate = doctor.ratings.find((r) => r._id == reviewId);

        if (!reviewToUpdate) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Review not found',
            });
        }

        if (rating !== undefined) {
            reviewToUpdate.rating = rating;
        }

        if (review !== undefined) {
            reviewToUpdate.review = review;
        }

        if (userId !== undefined) {
            reviewToUpdate.user = userId;
        }


        await doctor.save();

        return res.status(200).json({
            status: 'Success',
            message: 'Review updated successfully',
            data: reviewToUpdate,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'Failed',
            message: 'Error updating review',
            error: error.message,
        });
    }
};



exports.deleteReview = async (req, res) => {
    try {
        const { doctorId, reviewId } = req.params;

        const doctor = await Doctor.findById(doctorId);

        if (!doctor) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Doctor not found',
            });
        }

        if (!doctor.ratings || !Array.isArray(doctor.ratings)) {
            return res.status(404).json({
                status: 'Failed',
                message: 'ratings not found or invalid format',
            });
        }

        const reviewToDeleteIndex = doctor.ratings.findIndex((review) => review._id == reviewId);

        if (reviewToDeleteIndex === -1) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Review not found',
            });
        }

        doctor.ratings.splice(reviewToDeleteIndex, 1);
        await doctor.save();

        return res.status(200).json({
            status: 'Success',
            message: 'Review deleted successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'Failed',
            message: 'Error deleting review',
            error: error.message,
        });
    }
};



exports.getAllReviews = async (req, res) => {
    try {
        let data;
        if (req.params.doctorId) {
            const doctor = await Doctor.findById(req.params.doctorId);
            if (!doctor) {
                return res.status(404).json({
                    status: 'Failed',
                    message: 'Doctor not found',
                });
            }
            data = doctor.ratings;
        } else if (req.user && req.user.id) {
            const doctors = await Doctor.find({ 'ratings.user': req.user.id });
            const userReviews = [];
            doctors.forEach(doctor => {
                const reviews = doctor.ratings.filter(review => ratings.user.toString() === req.user.id);
                userReviews.push({
                    doctorId: doctor._id,
                    doctorName: doctor.doctorname,
                    reviews: reviews,
                });
            });
            data = userReviews;
        } else {
            return res.status(400).json({
                status: 'Failed',
                message: 'Invalid request. Provide doctorId or ensure user is logged in.',
            });
        }
        console.log(data);

        return res.status(200).json({
            status: 'Success',
            message: 'get data',
            data: data,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'Failed',
            message: 'Error retrieving reviews',
            error: error.message,
        });
    }
};



exports.addReplyToRating = async (req, res) => {
    try {
        const { doctorId, ratingId } = req.params;
        const { reply } = req.body;

        const doctor = await Doctor.findById(doctorId);

        if (!doctor) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Doctor not found',
            });
        }

        const ratingToUpdate = doctor.ratings.find((rating) => rating._id == ratingId);

        if (!ratingToUpdate) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Rating not found',
            });
        }

        ratingToUpdate.reply = reply;
        await doctor.save();

        return res.status(200).json({
            status: 'Success',
            message: 'Reply added to rating successfully',
            data: ratingToUpdate,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'Failed',
            message: 'Error adding reply to rating',
            error: error.message,
        });
    }
};
