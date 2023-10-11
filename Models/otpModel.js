const { Schema, model } = require("mongoose");
module.exports.Otp = model('Otp', Schema({
    phonenumber: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, index: { expires: 10000 } }
}, { timestamps: true }))