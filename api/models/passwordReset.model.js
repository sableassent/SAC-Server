const mongoose = require("mongoose");
const validators = require("../mongoValidators");
const PasswordResetSchema = new mongoose.Schema(
    {
        userEmail: {
            type: String,
            required: true,
            primaryKey: true
        },
        otp: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            required: true,
            defaultValue: Sequelize.NOW
        }
    },
    {
        timestamps: true,
        minimize: false,
        versionKey: false
    }
)

PasswordResetSchema.index({ accessToken: -1 });
PasswordResetSchema.index({ email: -1 });

// Handler **must** take 3 parameters: the error that occurred, the document
// in question, and the `next()` function
PasswordResetSchema.post('save', validators.duplicateKey);

module.exports = mongoose.model('PasswordReset', PasswordResetSchema);
