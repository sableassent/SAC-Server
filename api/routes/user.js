'use strict';
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const multerUtils = require("../utils/multerUtils");
const Multer = require("multer");

// without auth
router.post('/userCreate', UserController.userCreate);
router.use('/userLogin', UserController.userLogin);
router.post('/userResetPassword', UserController.userResetPassword);
router.post('/userNewPassword', UserController.userNewPassword);
router.post('/addReferral', UserController.addReferral);
router.post('/checkReferralCode', UserController.checkReferralCode);
router.post('/checkUsername', UserController.checkUsername);


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
router.post('/uploadProfilePicture', UserController.verifyToken, Multer({storage: Multer.memoryStorage(), fileFilter: multerUtils.multerImageFilter}).single("file"), UserController.uploadProfilePicture);
router.post('/getProfilePicture', UserController.verifyToken, UserController.getProfilePicture);

module.exports = router;
