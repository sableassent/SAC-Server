const mongoose = require("mongoose");

exports.start = async () => {
    await mongoose.connect("mongodb://mongo/sablecoin", {useNewUrlParser: true}, (error) => {
        console.error("Error has occurred conencting to  mongodb", error);
    })
}