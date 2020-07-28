const mongoose = require("mongoose");
const validators = require("../mongoValidators");
const VerificationSchema = require("./verification.model");

const UserSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: true,
            primaryKey: true
        },
        name: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phoneNumber: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true
        },
        walletAddress: {
            type: String,
            allowNull: true
        },
        referralCode: {
            type: String,
            required: true
        },
        accessToken: {
            token: {
                type: String,
            },
            isActive: {
                type: Boolean,
                default: false
            }
        },
        phoneNumberVerification: {
            type: VerificationSchema,
        },
        emailVerification: {
            type: VerificationSchema,
        },
        profilePicture: {
            type: String,
            required: false,
        }
    },
    {
        timestamps: true,
        minimize: false,
        versionKey: false
    }
)

UserSchema.index({ accessToken: -1 });
UserSchema.index({ email: -1 });

// Handler **must** take 3 parameters: the error that occurred, the document
// in question, and the `next()` function
UserSchema.post('save', validators.duplicateKey);

module.exports = mongoose.model('Users', UserSchema);
