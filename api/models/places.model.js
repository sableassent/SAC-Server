const mongoose = require("mongoose");
const validators = require("../mongoValidators");
const PlacesSchema = new mongoose.Schema(
    {
        html_attributions: {
            type: Array
        },
        result: {
            address_components: {
                long_name: String,
                short_name: String,
                types: [String]
            },
            adr_address: {
                type: String
            },
            formatted_address: {
                type: String
            },
            formatted_phone_number: {
                type: String
            },
            geometry: {
                location: {
                    lat: {
                        type: Number
                    },
                    lng: {
                        type: Number
                    }
                },
                viewport: {
                    northeast: {
                        lat: {
                            type: Number
                        },
                        lng: {
                            type: Number
                        }
                    },
                    southwest: {
                        lat: {
                            type: Number
                        },
                        lng: {
                            type: Number
                        }
                    }
                }
            },
            icon: {
                type: String
            },
            id: {
                type: String
            },
            international_phone_number: {
                type: String
            },
            name: {
                type: String
            },
            place_id: {
                type: String
            },
            rating: {
                type: Number
            },
            reference: {
                type: String
            },
            types: {
                type: [
                    String
                ]
            },
            url: {
                type: String
            },
            utc_offset: {
                type: Number
            },
            vicinity: {
                type: String
            },
            website: {
                type: String
            }
        },
        status: {
            type: String
        }
    }
);
PlacesSchema.post('save', validators.duplicateKey);