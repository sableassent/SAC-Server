'use strict';
const express = require('express');
const router = express.Router();
const FileUploadController = require('../controllers/fileUpload.controller');
const UserController = require('../controllers/user.controller');


router.get('/files/:id', UserController.verifyToken, FileUploadController.getFile);


module.exports = router;
