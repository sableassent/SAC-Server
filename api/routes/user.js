'use strict';
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');

// without auth
router.post('/userCreate', UserController.userCreate);
router.use('/userLogin', UserController.userLogin);
router.post('/userResetPassword', UserController.userResetPassword);
router.post('/userNewPassword', UserController.userNewPassword);
router.post('/addReferral', UserController.addReferral);
router.post('/checkReferralCode', UserController.checkReferralCode);

// with auth
router.post('/userChangePassword', UserController.verifyToken, UserController.userChangePassword);
router.post('/userLogout', UserController.verifyToken, UserController.userLogout);
router.post('/addWalletAddress', UserController.verifyToken, UserController.addWalletAddress);
router.post('/sendOTP', UserController.verifyToken,  UserController.sendOTP);
router.post('/verifyOTP', UserController.verifyToken, UserController.verifyOTP);
router.post('/referralStatusUpdate', UserController.verifyToken, UserController.referralStatusUpdate);
router.post('/getAllReferrals', UserController.verifyToken, UserController.getAllReferrals);
router.post('/getAllUsers', UserController.verifyToken, UserController.getAllUsers);
router.post('/contactUs', UserController.verifyToken, UserController.contactUs);

module.exports = router;
