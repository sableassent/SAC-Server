const BusinessService = require("../services/business.service");


exports.createBusiness = async function (req, res, next) {
    try {
        return res.status(200).send(await BusinessService.createBusiness(req.body, req.user));
    } catch (e) {
        return res.status(500).send(e.message);
    }
}


exports.findBusiness = async function (req, res, next) {
    try {
        return res.status(200).send(await BusinessService.findBusiness(req.query, req.user));
    } catch (e) {
        return res.status(500).send(e.message);
    }
}



exports.nearMe = async function (req, res, next) {
    try {
        return res.status(200).send(await BusinessService.findBusinessByLocation(req.query, req.user));
    } catch (e) {
        return res.status(500).send(e.message);
    }
}

exports.verifyBusiness = async (req, res, next) => {
    try{
        return res.status(200).send(await BusinessService.verifyBusiness(req.body, req.user));
    }catch (e) {
        res.status(500).send(e.message);
    }
}

exports.modifyBusiness = async (req, res, next) => {
    try{
        return res.status(200).send(await BusinessService.modifyBusiness(req.body, req.user));
    }catch (e) {
        res.status(500).send(e.message);
    }
}

exports.getBusinessByStatus = async (req, res, next) => {
    try{
        return res.status(200).send(await BusinessService.getBusinessByStatus(req.query, req.user));
    }catch (e) {
        res.status(500).send(e.message);
    }
}

exports.getCategories = async (req, res, next) => {
    try{
        return res.status(200).send(await BusinessService.getCategoryList(req.body, req.user));
    }catch (e) {
        res.status(500).send(e.message);
    }
}

exports.getMyBusiness = async (req, res, next) => {
    try{
        return res.status(200).send(await BusinessService.getMyBusiness(req.query, req.user));
    }catch (e) {
        res.status(500).send(e.message);
    }
}

exports.addImage = async (req, res, next) => {
    try{
        return res.status(200).send(await BusinessService.addBusinessImage(req, req.user));
    }catch (e) {
        res.status(500).send(e.message);
    }
}