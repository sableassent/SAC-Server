const mongoose = require("mongoose");
const Env = require("./env.js");

exports.start = async () => {
  await mongoose.connect(Env.MONGO_URL, { useNewUrlParser: true }, (error) => {
    if (error) console.error("Error has occurred connecting to mongodb", error);
  });
};
