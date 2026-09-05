// برای بخش  MineMarket.tsx

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
    }

}, { timestamps: true });

module.exports = mongoose.model("Store", storeSchema);