const mongoose = require("mongoose");


const ProductSchema = mongoose.Schema({
    productimage: { type: String },
    cloudinary_id: { type: String },
    productcategory: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Productcategory',
        index: true,
    },
    subproductcategories: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Subproductcategory',
        index: true,
    },
    name: {
        type: String,
    },
    price: {
        type: Number,
    },
    description: String,
    benefits: [String],
    ingredients: [String],
    uses: String,
    howToUse: String,
    safetyInformation: [String],
    faqs: [
        {
            question: String,
            answer: String,
        },
    ],
    productDetails: {
        expiry: Date,
        brand: String,
        countryOfOrigin: String,
        manufacturingDetails: String,
    },
    totalRating: Number,
    rating: [
        {
            rating: String,
            user: String,
            comment: String,
            reply: String,
        },
    ],
});

module.exports = mongoose.model("Product", ProductSchema);