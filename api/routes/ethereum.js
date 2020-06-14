'use strict';
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const EthereumController = require('../controllers/ethereum.controller');

router.post('/transferEtherless', EthereumController.transferEtherless);
router.get('/fees', EthereumController.getFees);

router.use(UserController.verifyToken);
router.get('/isActivated', EthereumController.isActivated);
router.post('/activate', EthereumController.activate);
router.post('/search', EthereumController.search);
router.post('/downloadAsCsv', EthereumController.downloadAsCsv);
router.post('/transferOwnership', EthereumController.transferOwnership);
router.post('/withdraw', EthereumController.withdraw);
router.post('/fees', EthereumController.setFees);

module.exports = router;
