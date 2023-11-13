const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");
require('mongoose-double')(mongoose);
const SchemaTypes = mongoose.Schema.Types;

const doctorSchema = new Schema({
    availability: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Availability',
    },
    doctorname: { type: String, required: true },
    doctorspicture: { type: String },
    yearexperience: { type: String },
    rating: { type: SchemaTypes.Double, default: 0 },
    content: { type: String },
    phonenumber: { type: String },
    email: { type: String },
    cloudinary_id: { type: String },
    location: {
        type: {
            type: String,
            default: 'Point',
        },
        coordinates: {
            type: [Number],
        },
    },
    fee: { type: Number, default: 0 },
    treatmentCount: { type: Number, default: 0 },
    maxPatients: { type: Number, default: 0 },
}, { timestamps: true });

doctorSchema.index({ location: '2dsphere' });

module.exports.Doctor = model('Doctor', doctorSchema);


