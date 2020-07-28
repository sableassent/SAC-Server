const FileUploadService = require("../services/fileUpload.service");

exports.getFile = async function (req, res, next) {
    try {
        await FileUploadService.getFile(req, res, req.user);
    } catch (e) {
        return res.status(500).send(e.message);
    }
}

// exports.uploadFile = async function (req, res, next) {
//     try{
//         await FileUploadService.uploadFile(req, res, req.user);
//
//     }catch (e) {
//         return res.status(500).send(e.message);
//     }
// }
