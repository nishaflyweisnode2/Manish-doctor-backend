const { Schema, model } = require("mongoose")

module.exports.AdminAuth = model('AdminAuth', Schema({
    fullname: { type: String,trim:true },
    isAdmin: { type: String, default: true },
    number: { type: String },
    email: { type: String },
    password: { type: String },
    verified:{type:Boolean}
}, { timestamps: true }))

