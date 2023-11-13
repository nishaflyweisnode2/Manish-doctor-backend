const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const slotSchema = new Schema({
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    numberOfPatients: {
        type: Number,
        default: 0,
    },
    maxPatients: {
        type: Number,
        default: 0,
    },
});

const availabilitySchema = new Schema({
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
    },
    slots: [slotSchema],
});

const Availability = mongoose.model('Availability', availabilitySchema);

module.exports = Availability;
