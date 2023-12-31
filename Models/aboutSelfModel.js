const mongoose = require("mongoose");


const AboutselfSchema = mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    weight: { type: String, required: true },
    bloodgroup: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true }
})
module.exports = mongoose.model("Aboutself", AboutselfSchema);