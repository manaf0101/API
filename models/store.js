const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true,
        unique: true
    },

    storeName: {
        type: String,
        required: true
    },

    sellerID: {
        type: String,
        required: true,
        unique: true
    },

    username: {
        type: String,
        required: true,
        unique: true
    },

    welcomeMessage: {
        type: String
    },

    contactInfo: {
        phone1: {
            type: String,
            required: true
        },
        phone2: {
            type: String
        },
        email: {
            type: String
        },
        address: {
            type: String
        }
    }

}, { timestamps: true });

module.exports = mongoose.model("Store", storeSchema);