const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

const videoCallSchema = new Schema({
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    date: {
        type: Date,
    },
    duration: {
        type: Number,
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Completed', 'Canceled'],
        default: 'Scheduled',
    },

}, { timestamps: true });

const VideoCall = model('VideoCall', videoCallSchema);

module.exports = VideoCall;
