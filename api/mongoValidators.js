module.exports.duplicateKey = function(error, doc, next) {
    console.log(error);
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error(`User exists with same ${JSON.stringify(error.keyValue)}`));
    } else {
        next(error);
    }
}
