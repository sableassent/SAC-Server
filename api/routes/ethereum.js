'use strict';
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const EthereumController = require('../controllers/ethereum.controller');

router.post('/transferEtherless', EthereumController.transferEtherless);
router.get('/tx/:_id', EthereumController.getTransaction);
router.get('/fees', EthereumController.getTotalFees);
router.get('/separateFees', EthereumController.getSeparateFees);
router.get('/nonce', EthereumController.getNonce);
router.get('/converter', EthereumController.converter);
router.get('/isActivated', UserController.verifyToken, EthereumController.isActivated);
router.post('/activate', UserController.verifyToken, EthereumController.activate);
router.post('/search', UserController.verifyToken, EthereumController.search);
router.post('/downloadAsCsv', UserController.verifyToken, EthereumController.downloadAsCsv);
router.post('/withdraw', UserController.verifyToken, EthereumController.withdraw);
router.post('/fees', UserController.verifyToken, EthereumController.setFees);

module.exports = router;
