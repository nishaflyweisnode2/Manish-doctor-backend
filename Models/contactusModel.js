const { Schema, model } = require("mongoose");
module.exports.Contact = model('Contact', Schema({
    companyname: { type: String, required: true },
    email: { type: String,required: true },
    contactnumber: { type: String,required: true },
    address: { type: String,required: true }
}, { timestamps: true }));