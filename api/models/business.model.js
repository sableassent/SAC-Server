const mongoose = require("mongoose");
const locationPoint = require("./locationPoint.model");
const addressSchema = require("./address.model");
const validators = require("../mongoValidators");
const businessCategories = require("./businessCategory.model");
const VerificationSchema = require("./verification.model");
const PlacesSchema = require("./places.model");
const Schema = mongoose.Schema;

const BusinessSchema = new mongoose.Schema(
    {
        user: {
            type: Schema.ObjectId, ref: 'Users'
        },
        name: {
            type: String,
            required: true,
        },
        description: {
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
        placesModel: {
            type: PlacesSchema,
        },
        location: {
            type: locationPoint,
            required: true,
        },
        verification: {
            type: String,
            enum: ['PENDING', 'VERIFIED', 'REJECTED'],
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
        websiteUrl: {
            type: String,
            required: false,
        },
        twitterUrl: {
            type: String,
            required: false,
        },
        instagramUrl: {
            type: String,
            required: false,
        },
        facebookUrl: {
            type: String,
            required: false,
        },
        foundationYear: {
            type: String,
            required: true
        },
        images: [{
            createdAt: {
                type: Date,
                default: Date.now,
                required: true
            },
            imageId: {
                type: String
            }
        }]
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
