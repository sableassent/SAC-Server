'use strict';
const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin.controller');

router.use('/login', AdminController.login);
router.get('/me', AdminController.verifyToken, AdminController.me);
router.post('/changePassword', AdminController.verifyToken, AdminController.changePassword);
router.post('/logout', AdminController.verifyToken, AdminController.logout);

module.exports = router;
