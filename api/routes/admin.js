'use strict';
const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin.controller');


//without auth
router.use('/login', AdminController.login);
router.get('/me', AdminController.verifyToken, AdminController.me);


//with auth
router.post('/create', AdminController.verifyToken, AdminController.create);
// router.post('/resetPassword', AdminController.verifyToken, AdminController.resetPassword);
router.post('/changePassword', AdminController.verifyToken, AdminController.changePassword);
router.post('/logout', AdminController.verifyToken, AdminController.logout);
router.get('/getUser', AdminController.verifyToken, AdminController.getUser);

module.exports = router;
