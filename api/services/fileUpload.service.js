const bucketName = "public-images"
const utils = require("../utils")
const minioClient = require("../minio");

exports.getFile = async function (req, res, user) {
    minioClient.getObject(bucketName, req.params.id, function(error, stream) {
        if(error) {
            return res.status(500).send(error);
        }
        stream.pipe(res);
    });
}

exports.uploadFileUnique = async function (req) {
    const uniqueFileID = utils.getUid(32, 'alphaNumeric');
    const fileNameSplit = req.file.originalname.split(".");
    const extension = fileNameSplit[fileNameSplit.length-1];
    const pictureName = `${uniqueFileID}.${extension}`;
    return new Promise(((resolve, reject) => {
        minioClient.putObject(bucketName, pictureName, req.file.buffer, function(error, etag) {
            if(error) {
                console.log(error);
                reject(error);
            }
            resolve(pictureName);
            // upload image path to user
        });
    }))
}