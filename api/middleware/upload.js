// const multer = require("multer");
// const GridFsStorage = require("multer-gridfs-storage");
//
// const storage = new GridFsStorage({
//     url: "mongodb://localhost:27017/bezkoder_files_db",
//     options: { useNewUrlParser: true, useUnifiedTopology: true },
//     file: (req, file) => {
//         const match = ["image/png", "image/jpeg"];
//
//         if (match.indexOf(file.mimetype) === -1) {
//             const filename = `${Date.now()}-bezkoder-${file.originalname}`;
//             return filename;
//         }
//
//         return {
//             bucketName: "photos",
//             filename: `${Date.now()}-bezkoder-${file.originalname}`
//         };
//     }
// });
//
// const uploadFile = multer({ storage: storage }).single("file");
// const uploadFilesMiddleware = util.promisify(uploadFile);
// module.exports = uploadFilesMiddleware;