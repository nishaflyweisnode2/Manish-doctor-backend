const { Schema, model } = require("mongoose");
module.exports.Faqs = model('Faqs', Schema({
    faq: { type: String, required: true },
}, { timestamps: true }));