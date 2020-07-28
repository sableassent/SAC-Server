const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    houseNumber: {
        type: String,
    },
    streetName: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    country: {
        type: String,
    },
    zipCode: {
        type: String,
    },
    landmark: {
        type: String,
    }
});

module.exports = addressSchema;