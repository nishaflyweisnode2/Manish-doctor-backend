const mongoose=require("mongoose")

const { Schema, model } = require("mongoose");
require('mongoose-double')(mongoose);
var SchemaTypes = mongoose.Schema.Types;
module.exports.Doctor = model('Doctor', Schema({
    doctorname: { type: String, required: true},
    doctorspicture:{type:String},
    yearexperience: { type: String },
    rating: { type:SchemaTypes.Double,default:0 },
    content: { type: String},
    phonenumber: {type: String},
    email: {type: String},
    cloudinary_id: {type: String}
}, { timestamps: true }));