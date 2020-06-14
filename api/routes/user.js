'use strict';
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');

router.use('/login', UserController.login);

router.use(UserController.verifyToken);
router.get('/me', UserController.me);
router.post('/changePassword', UserController.changePassword);
router.post('/logout', UserController.logout);

module.exports = router;
