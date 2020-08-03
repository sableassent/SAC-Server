const mongoose = require("mongoose");

const MONGO_HOST = process.env.MONGO_HOST;
const MONGO_DATABASE = process.env.MONGO_DATABASE;

const mongoURL = `mongodb://${MONGO_HOST}/${MONGO_DATABASE}`

exports.start = async () => {
    await mongoose.connect(mongoURL, {useNewUrlParser: true}, (error) => {
        if(error)
        console.error("Error has occurred connecting to  mongodb", error);
    })
}
