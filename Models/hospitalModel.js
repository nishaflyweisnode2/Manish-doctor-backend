const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
    image: {
        type: String,
    },
    name: {
        type: String,

    },
    rating: {
        type: Number,
        default: 0,
    },
    address: {
        type: String,

    },
    pincode: {
        type: String,

    },
    description: {
        type: String,

    },
    facilities: {
        type: [String],

    },
}, { timestamps: true });

const Hospital = mongoose.model('Hospital', hospitalSchema);

module.exports = Hospital;
