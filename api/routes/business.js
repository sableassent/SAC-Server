'use strict';
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const AdminController = require('../controllers/admin.controller');
const BusinessController = require("../controllers/business.controller")

//without auth


//with auth
//user
router.post('/business/create', UserController.verifyToken, BusinessController.createBusiness);
router.post('/business/find',   UserController.verifyToken, BusinessController.findBusiness);
router.post('/business/nearMe', UserController.verifyToken, BusinessController.nearMe)
router.post("/business/modify", UserController.verifyToken, BusinessController.modifyBusiness)
router.post("/business/getCategories", UserController.verifyToken, BusinessController.getCategories)


//admin
router.post("/business/verify", AdminController.verifyToken, BusinessController.verifyBusiness)
router.post("/business/getByStatus", AdminController.verifyToken, BusinessController.getBusinessByStatus)

module.exports = router;
