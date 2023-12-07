const { StatusCodes } = require('http-status-codes');
const Appointment = require('../Models/appointmentModel');
// const Doctor = require("../Models/doctorModel");
const { Doctor } = require("../Models/doctorModel");
const Availability = require("../Models/slotAvailabilityModel");
const userModel = require('../Models/usersAuthModel');
const mongoose = require('mongoose');




exports.createAppointment = async (req, res) => {
    try {
        const { doctorId, startTime, endTime, appointmentDate, slot, appointmentType } = req.body;

        if (!req.user || !req.user.id) {
            return res.status(404).json({
                status: 'Failed',
                message: 'User not found or invalid user structure',
            });
        }

        const user = await userModel.findOne({ id: req.user.id });

        if (!user) {
            return res.status(404).json({
                status: 'Failed',
                message: 'User not found',
            });
        }

        const checkDoctor = await Doctor.findOne({ id: doctorId });
        if (!checkDoctor) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Doctor not found',
            });
        }

        const availability = await Availability.findOne({
            doctor: doctorId,
            'slots.startTime': startTime,
            'slots.endTime': endTime,
        });

        if (!availability) {
            return res.status(400).json({
                status: 'Failed',
                message: 'Doctor is not available at the specified time',
            });
        }

        const slotIndex = availability.slots.findIndex(
            (slot) => slot.startTime === startTime && slot.endTime === endTime
        );

        if (slotIndex === -1 || availability.slots[slotIndex].numberOfPatients >= availability.slots[slotIndex].maxPatients) {
            return res.status(400).json({
                status: 'Failed',
                message: 'Slot is not available or fully booked',
            });
        }

        const appointment = new Appointment({
            doctor: doctorId,
            user: req.user.id,
            avilableTime: availability._id,
            appointmentDate,
            slot,
            appointmentType,
            startTime,
            endTime,
        });

        await appointment.save();

        availability.slots[slotIndex].numberOfPatients += 1;
        await availability.save();

        checkDoctor.treatmentCount += 1;
        await checkDoctor.save();

        return res.status(200).json({
            status: 'Success',
            message: 'Appointment created successfully',
            data: appointment,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'Failed',
            message: 'Error creating appointment',
            error: error.message,
        });
    }
};


exports.getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate({
                path: 'doctor',
                populate: {
                    path: 'specialityId',
                    model: 'Specialist',
                },
            })
            .populate('user')
            .populate('avilableTime');

        return res.status(200).json({
            status: 'Success',
            data: appointments,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'Failed',
            message: 'Error fetching appointments',
            error: error.message,
        });
    }
};



exports.getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.appointmentId)
            .populate({
                path: 'doctor',
                populate: {
                    path: 'specialityId',
                    model: 'Specialist',
                },
            })
            .populate('user')
            .populate('avilableTime');

        if (!appointment) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Appointment not found',
            });
        }

        return res.status(200).json({
            status: 'Success',
            data: appointment,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'Failed',
            message: 'Error fetching appointment',
            error: error.message,
        });
    }
};



exports.updateAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.appointmentId,
            req.body,
            { new: true, runValidators: true }
        ).populate('doctor').populate('user').populate('avilableTime');

        if (!appointment) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Appointment not found',
            });
        }

        return res.status(200).json({
            status: 'Success',
            message: 'Appointment updated successfully',
            data: appointment,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'Failed',
            message: 'Error updating appointment',
            error: error.message,
        });
    }
};



exports.deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.appointmentId).populate('doctor').populate('user').populate('avilableTime');

        if (!appointment) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Appointment not found',
            });
        }

        return res.status(200).json({
            status: 'Success',
            message: 'Appointment deleted successfully',
            data: appointment,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'Failed',
            message: 'Error deleting appointment',
            error: error.message,
        });
    }
};


exports.updateAppointmentStatus = async (req, res) => {
    try {
        const appointmentId = req.params.appointmentId
        const { newStatus } = req.body;

        if (!appointmentId || !newStatus) {
            return res.status(400).json({
                status: 'Failed',
                message: 'Appointment ID and new status are required for updating status',
            });
        }

        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Appointment not found',
            });
        }

        appointment.status = newStatus;
        await appointment.save();

        return res.status(200).json({
            status: 'Success',
            message: 'Appointment status updated successfully',
            data: appointment,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'Failed',
            message: 'Error updating appointment status',
            error: error.message,
        });
    }
};

