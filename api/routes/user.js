'use strict';
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');

// without auth
router.post('/userCreate', UserController.userCreate);
router.use('/userLogin', UserController.userLogin);
router.post('/userResetPassword', UserController.userResetPassword);
router.post('/userNewPassword', UserController.userNewPassword);
router.post('/sendOTP', UserController.sendOTP);
router.post('/verifyOTP', UserController.verifyOTP);

// with auth
router.get('/userMe', UserController.verifyToken, UserController.userMe);
router.post('/userChangePassword', UserController.verifyToken, UserController.userChangePassword);
router.post('/userLogout', UserController.verifyToken, UserController.userLogout);
router.post('/addWalletAddress', UserController.verifyToken, UserController.addWalletAddress);
router.post('/addReferral', UserController.verifyToken, UserController.addReferral);

module.exports = router;
