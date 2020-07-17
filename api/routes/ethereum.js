'use strict';
const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin.controller');
const EthereumController = require('../controllers/ethereum.controller');

router.post('/transferEtherless', EthereumController.transferEtherless);
router.get('/tx/:_id', EthereumController.getTransaction);
router.get('/fees', EthereumController.getTotalFees);
router.get('/separateFees', EthereumController.getSeparateFees);
router.get('/nonce', EthereumController.getNonce);
router.get('/converter', EthereumController.converter);
router.get('/isActivated', AdminController.verifyToken, EthereumController.isActivated);
router.post('/activate', AdminController.verifyToken, EthereumController.activate);
router.post('/search', AdminController.verifyToken, EthereumController.search);
router.post('/downloadAsCsv', AdminController.verifyToken, EthereumController.downloadAsCsv);
router.post('/withdraw', AdminController.verifyToken, EthereumController.withdraw);
router.post('/fees', AdminController.verifyToken, EthereumController.setFees);

module.exports = router;
