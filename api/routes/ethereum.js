'use strict';
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const EthereumController = require('../controllers/ethereum.controller');

router.post('/transferEtherless', EthereumController.transferEtherless);
router.get('/fees', EthereumController.getFees);
router.get('/isActivated', UserController.verifyToken, EthereumController.isActivated);
router.post('/activate', UserController.verifyToken, EthereumController.activate);
router.post('/search', UserController.verifyToken, EthereumController.search);
router.post('/downloadAsCsv', UserController.verifyToken, EthereumController.downloadAsCsv);
router.post('/transferOwnership', UserController.verifyToken, EthereumController.transferOwnership);
router.post('/withdraw', UserController.verifyToken, EthereumController.withdraw);
router.post('/fees', UserController.verifyToken, EthereumController.setFees);

module.exports = router;
