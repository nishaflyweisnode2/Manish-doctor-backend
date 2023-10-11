const { Schema, model } = require("mongoose");
module.exports.Healthcategory = model('Healthcategory', Schema({
    healthcategoryname: { type: String, required: true },
    healthcategoryimage: { type: String },
    cloudinary_id: { type: String }
}, { timestamps: true }));