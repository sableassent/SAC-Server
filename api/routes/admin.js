'use strict';
const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin.controller');

router.post('/create', AdminController.create);
router.use('/login', AdminController.login);
router.get('/me', AdminController.verifyToken, AdminController.me);
router.post('/resetPassword', AdminController.verifyToken, AdminController.resetPassword);
router.post('/changePassword', AdminController.verifyToken, AdminController.changePassword);
router.post('/logout', AdminController.verifyToken, AdminController.logout);

module.exports = router;
