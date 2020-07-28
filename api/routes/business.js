'use strict';
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const AdminController = require('../controllers/admin.controller');
const BusinessController = require("../controllers/business.controller")
const Multer = require("multer");
const multerUtils = require("../utils/multerUtils");

//without auth


//with auth
//user
router.post('/business/create', UserController.verifyToken, BusinessController.createBusiness);
router.get('/business/find',   UserController.verifyToken, BusinessController.findBusiness);
router.get('/business/nearMe', UserController.verifyToken, BusinessController.nearMe)
router.post("/business/modify", UserController.verifyToken, BusinessController.modifyBusiness)
router.get("/business/getCategories", UserController.verifyToken, BusinessController.getCategories)
router.get("/business/getMyBusiness", UserController.verifyToken, BusinessController.getMyBusiness)
router.post("/business/addImage", UserController.verifyToken, Multer({storage: Multer.memoryStorage(), fileFilter: multerUtils.multerImageFilter}).single("file"), BusinessController.addImage);

//admin
router.post("/business/verify", AdminController.verifyToken, BusinessController.verifyBusiness)
router.get("/business/getByStatus", AdminController.verifyToken, BusinessController.getBusinessByStatus)

module.exports = router;
