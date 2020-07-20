'use strict';
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');

router.post('/userCreate', UserController.userCreate);
router.use('/userLogin', UserController.userLogin);
router.get('/userMe', UserController.verifyToken, UserController.userMe);
router.post('/userResetPassword', UserController.verifyToken, UserController.userResetPassword);
router.post('/userChangePassword', UserController.verifyToken, UserController.userChangePassword);
router.post('/userLogout', UserController.verifyToken, UserController.userLogout);
router.post('/addWalletAddress', UserController.verifyToken, UserController.addWalletAddress);

module.exports = router;
