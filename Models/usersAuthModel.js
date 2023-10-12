const mongoose = require("mongoose");


const UsersAuthSchema = mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userspicture: { type: String, default: null },
    cloudinary_id: { type: String, default: null },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
}, { timestamps: true })
module.exports = mongoose.model("User", UsersAuthSchema);
