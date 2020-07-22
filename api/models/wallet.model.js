
const mongoose = require("mongoose");
const validators = require("../mongoValidators");
const WalletSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: true,
        },
        privateKey: {
            type: String,
            required: true
        },
        balanceETH: {
            type: Number,
            required: false
        },
        balanceSAC: {
            type: Number,
            required: false
        },
        fixedFees: {
            type: Number,
            required: false
        },
        percentFees: {
            type: Number,
            required: false
        }
    },
    {
        timestamps: true,
        minimize: false,
        versionKey: false
    }
);

// Handler **must** take 3 parameters: the error that occurred, the document
// in question, and the `next()` function
WalletSchema.post('save', validators.duplicateKey);

module.exports = mongoose.model('Wallet', WalletSchema);
