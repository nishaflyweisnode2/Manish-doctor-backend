const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");
module.exports.Faqcontent = model('Faqcontent', Schema({
    faqcontentname: { type: String, required: true },
    faqid:{type: mongoose.Schema.Types.ObjectId, ref: 'Faqs', index: true,required:true}
}, { timestamps: true }));