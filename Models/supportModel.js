const { Schema, model } = require("mongoose");
module.exports.Support = model('Support', Schema({
    name: { type: String, required: true },
    email: { type: String,required: true },
    contactnumber: { type: String,required: true },
    message: { type: String,required: true },
    userID:{ type:Schema.Types.ObjectId,ref:"User",index: true,required:true}
}, { timestamps: true }));