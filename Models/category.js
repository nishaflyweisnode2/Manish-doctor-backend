const { Schema, model } = require("mongoose");
module.exports.Category = model('Category', Schema({
    categoryname: { type: String, required: true },
    categoryimage: { type: String },
    cloudinary_id: { type: String }
}, { timestamps: true }));