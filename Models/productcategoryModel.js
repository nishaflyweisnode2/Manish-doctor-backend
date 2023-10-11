const { Schema, model } = require("mongoose");
module.exports.Productcategory = model('Productcategory', Schema({
    productcatname: { type: String, required: true},
    productcatimage: { type: String },
    cloudinary_id: { type: String }
}, { timestamps: true }));