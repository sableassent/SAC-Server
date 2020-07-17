'use strict'
const express = require('express');
const router = express.Router();

const admin = require('./admin');
const ethereum = require('./ethereum');

router.use('/time', async (req, res) => res.status(200).send(new Date().toISOString()));
router.use(admin);
router.use(ethereum);

module.exports = router;
