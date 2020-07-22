const mongoose = require("mongoose");
const validators = require("../mongoValidators");
const AdminSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true
        },
        accessToken: {
            token: {
                type: String,
            },
            isActive: {
                type: Boolean,
            }
        }
    },
    {
        timestamps: true,
        minimize: false,
        versionKey: false
    }
)

AdminSchema.index({ accessToken: -1 });
AdminSchema.index({ email: -1 });

// Handler **must** take 3 parameters: the error that occurred, the document
// in question, and the `next()` function
AdminSchema.post('save', validators.duplicateKey);

module.exports = mongoose.model('Admin', AdminSchema);
