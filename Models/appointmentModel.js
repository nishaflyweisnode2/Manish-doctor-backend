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
    appointmentDate: {
        type: Date,
    },
    slot: {
        type: String,
        enum: ['Morning', 'Afternoon', 'Evening'],
    },
    appointmentType: {
        type: String,
        enum: ['Online', 'Offline'],
    },
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
