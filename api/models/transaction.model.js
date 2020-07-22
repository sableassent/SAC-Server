const mongoose = require("mongoose");
const validators = require("../mongoValidators");
const TransactionSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: true,
        },
        from: {
            type: String,
            required: true
        },
        to: {
            type: String,
            required: true
        },
        amount: {
            type: String,
            required: false
        },
        amountInFloat: {
            type: Number,
            required: false
        },
        fees: {
            type: String,
            required: false
        },
        feesInFloat: {
            type: Number,
            required: false
        },
        nonce: {
            type: Number,
            required: false
        },
        status: {
            type: String,
            required: true
        },
        updatedAt: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true,
        minimize: false,
        versionKey: false
    }
)
// Handler **must** take 3 parameters: the error that occurred, the document
// in question, and the `next()` function
TransactionSchema.post('save', validators.duplicateKey);

TransactionSchema.index({ status: -1 });

module.exports = mongoose.model('Transaction', TransactionSchema);
