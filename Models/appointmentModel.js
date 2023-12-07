const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    avilableTime: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Availability',
    },
    appointmentDate: {
        type: String,
    },
    slot: {
        type: String,
        enum: ['Morning', 'Afternoon', 'Evening'],
    },
    status: {
        type: String,
        enum: ['Pending', 'Complete'],
        default: 'Pending'
    },
    appointmentType: {
        type: String,
        enum: ['Online', 'Offline'],
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
