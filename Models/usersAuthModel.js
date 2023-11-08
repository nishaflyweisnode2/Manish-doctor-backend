const mongoose = require("mongoose");


const UsersAuthSchema = mongoose.Schema({
    firstname: { type: String, },
    lastname: { type: String, },
    email: { type: String, unique: true },
    password: { type: String, },
    socialType: {
        type: String,
    },
    userspicture: { type: String, default: null },
    cloudinary_id: { type: String, default: null },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
}, { timestamps: true })
module.exports = mongoose.model("User", UsersAuthSchema);
