const mongoose = require("mongoose");
const validators = require("../mongoValidators");
const ReferralSchema = new mongoose.Schema(
    {
        from: {
            type: String,
            required: true,
        },
        to: {
            type: String,
            required: true,
        },
        referralCode: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true
        },
        transactionHash: {
            type: String,
            required: false
        },
        createdAt: {
            type: Date,
            required: true,
            default: Date.now
        },
        completedAt: {
            type: Date,
            required: false,
        },
    },
    {
        timestamps: true,
        minimize: false,
        versionKey: false
    }
)


// Handler **must** take 3 parameters: the error that occurred, the document
// in question, and the `next()` function
ReferralSchema.post('save', validators.duplicateKey);

module.exports = mongoose.model('Referrals', ReferralSchema);