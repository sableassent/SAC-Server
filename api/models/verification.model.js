const mongoose = require("mongoose");

const VerificationSchema = new mongoose.Schema({
    otp: {
        type: String,
    },
    createdAt: {
        type: Date
    },
    isVerified: {
        type:Boolean,
        required: true,
        default: false
    }
});

module.exports = VerificationSchema;