'use strict';
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');

router.use('/login', UserController.login);
router.get('/me', UserController.verifyToken, UserController.me);
router.post('/changePassword', UserController.verifyToken, UserController.changePassword);
router.post('/logout', UserController.verifyToken, UserController.logout);

module.exports = router;
