const { Schema, model } = require("mongoose");
module.exports.Testimony = model('Testimony', Schema({
    testimonycontent: { type: String, required: true },
    testimonyimage: { type: String },
    cloudinary_id: { type: String }
}, { timestamps: true }));