const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    // شناسه‌ی فروشنده‌ای که این محصول متعلق به اوست (userId)
    sellerId: {
        type: String,
        required: true
    },

    tag: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    discountPrice: {
        type: Number
    },

    description: {
        type: String
    },

    imageUrl: {
        type: String,
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);