'use strict'
const express = require('express');
const router = express.Router();

const user = require('./user');
const ethereum = require('./ethereum');

router.use('/time', async (req, res) => res.status(200).send(new Date().toISOString()));
router.use(user);
router.use(ethereum);

module.exports = router;
