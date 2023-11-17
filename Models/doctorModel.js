const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");
require('mongoose-double')(mongoose);
const SchemaTypes = mongoose.Schema.Types;

const doctorSchema = new Schema({
    availability: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Availability',
    },
    doctorname: { type: String, },
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
            default: [0, 0]
        },
    },
    otp: { type: String, },
    fee: { type: Number, default: 0 },
    treatmentCount: { type: Number, default: 0 },
    maxPatients: { type: Number, default: 0 },
    dateOfBirth: { type: Date },
    registrationNumber: { type: String },
    idProof: { type: String },
    digitalSignature: { type: String },
    clinicPhoto: { type: String },
    letterHead: { type: String },
    registrationCertificate: { type: String },
    medicalDegrees: { type: String },
    specialityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Specialist',
    },
    age: { type: Number },
    weight: { type: Number },
    height: { type: Number },
    registration1: { type: Boolean, default: false },
    registration2: { type: Boolean, default: false },
}, { timestamps: true });

doctorSchema.index({ location: '2dsphere' });

module.exports.Doctor = model('Doctor', doctorSchema);


