const mongoose = require("mongoose");
// require('dotenv').config()


const MONGO_HOST = process.env.MONGO_HOST;
const MONGO_DATABASE = process.env.MONGO_DATABASE;

const mongoURL = `mongodb://${MONGO_HOST}/${MONGO_DATABASE}`
// const mongoURL  = `mongodb+srv://Test:qwertyuiop@cluster0.i8dreup.mongodb.net/?retryWrites=true&w=majority`

exports.start = async () => {
    await mongoose.connect(mongoURL, {useNewUrlParser: true}, (error) => {
        if(error)
            console.error("Error has occurred connecting to mongodb", error);
    })
}
