const mongoose = require("mongoose");
const locationPoint = require("./locationPoint.model");
const addressSchema = require("./address.model");
const validators = require("../mongoValidators");
const businessCategories = require("./businessCategory.model");
const VerificationSchema = require("./verification.model");

const BusinessSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: true
        },
        userId: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true,
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
        address: {
            type: addressSchema,
            required: true,
        },
        location: {
            type: locationPoint,
            required: true,
        },
        verification: {
            type: String,
            enum: ['PENDING', 'VERIFIED'],
            required: true,
            default: "PENDING",
        },
        category: {
            type: String,
            enum: businessCategories.categories,
            required: true
        },
        phoneNumberVerification: {
            type: VerificationSchema,
        },
        emailVerification: {
            type: VerificationSchema,
        },
    },
    {
        timestamps: true,
        minimize: false,
        versionKey: false
    }
)

BusinessSchema.index({ name: -1 });
BusinessSchema.index({ email: -1 });
BusinessSchema.index({ phoneNumber: -1 });
BusinessSchema.index({ location: "2dsphere" });


// Handler **must** take 3 parameters: the error that occurred, the document
// in question, and the `next()` function
BusinessSchema.post('save', validators.duplicateKey);

module.exports = mongoose.model('Businesses', BusinessSchema);
