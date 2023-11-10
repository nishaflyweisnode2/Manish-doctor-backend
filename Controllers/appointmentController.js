const { StatusCodes } = require('http-status-codes');
const Appointment = require('../Models/appointmentModel');
const { Doctor } = require("../Models/doctorModel");


exports.createAppointment = async (req, res) => {
    try {
        const { doctorId, appointmentDate, slot, appointmentType } = req.body;

        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'Failed',
                message: 'Doctor not found.',
            });
        }

        const appointment = new Appointment({
            doctor: doctorId,
            user: req.user.id,
            appointmentDate,
            slot,
            appointmentType,
        });

        await appointment.save();

        return res.status(StatusCodes.CREATED).json({
            status: 'Success',
            message: 'Appointment created successfully',
            data: appointment,
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: 'Error creating appointment',
            error: error.message,
        });
    }
};




exports.checkDoctorAvailability = async (doctorId, appointmentDate, requestedSlot) => {
    try {
        const doctor = await Doctor.findById(doctorId);

        if (!doctor) {
            return { available: false, message: 'Doctor not found' };
        }

        const availabilityForDate = doctor.availability.find(avail => avail.date.toDateString() === new Date(appointmentDate).toDateString());

        if (!availabilityForDate) {
            return { available: false, message: 'Doctor not available on the specified date' };
        }

        if (!availabilityForDate.slots.includes(requestedSlot)) {
            return { available: false, message: 'Requested slot is not available' };
        }

        return { available: true, message: 'Doctor is available' };
    } catch (error) {
        console.error(error);
        return { available: false, message: 'Error checking doctor availability' };
    }
};