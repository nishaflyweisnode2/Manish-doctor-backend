const { Schema, model } = require("mongoose");
module.exports.Specialist = model('Specialist', Schema({
    Specialistname: { type: String, required: true },
    specialistimage: { type: String },
    specialiseon: { type: String },
    cloudinary_id: { type: String }
}, { timestamps: true }));