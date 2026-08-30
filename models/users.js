const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({

    userEmail: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    userId: {
        type: String,
        required: true
    },

    fullName: {
        type: String
    },

    userPhone: {
        type: String
    },

    userBirth: {
        type: Date
    },

    userNationalityCode: {
        type: String   // قبلاً Number بود، به دلیل کد ملی‌های شروع‌شونده با صفر تغییر کرد
    },

    job: {
        type: String
    },

    refundMethod: {
        shebaNumber: {
            type: String
        }
    },

    userProfileImage: {
        type: String
    }

});

module.exports = mongoose.model("Users", usersSchema);