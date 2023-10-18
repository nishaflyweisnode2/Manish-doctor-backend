const { Schema, model } = require("mongoose");
module.exports.Faqs = model('Faqs', Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
}, { timestamps: true }));