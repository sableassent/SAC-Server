'use strict'
const express = require('express');
const router = express.Router();

const admin = require('./admin');
const ethereum = require('./ethereum');
const user = require('./user');
const business = require('./business');
const filesUpload = require('./fileUpload');

router.use('/time', async (req, res) => res.status(200).send(new Date().toISOString()));
router.use(admin);
router.use(ethereum);
router.use(user);
router.use(business);
router.use(filesUpload);

module.exports = router;
