const AdminService = require('../services/admin.service');
const EthereumService = require('../services/ethereum.service');
const passwordUtils = require("../utils/passwordUtils")

exports.create = async function (req, res, next) {
    try {
        let _id = await AdminService.create(req.body);
        return res.status(200).json({
            id: _id
        });
    } catch (e) {
        return res.status(500).send(e.message);
    }
}

exports.login = async function (req, res, next) {
    try {
        let [adminAccessToken, admin] = await AdminService.login(req.body);
        return res.status(200).json({
            tokenType: 'Bearer',
            adminAccessToken: adminAccessToken,
            admin: admin,
        });
    } catch (e) {
        return res.status(500).send(e.message);
    }
}

exports.verifyToken = passwordUtils.verifyToken(AdminService);

exports.me = async function (req, res, next) {
    try {
        let wallet = await EthereumService.getWallet();
        let admin = await AdminService.findById(req.admin._id);
        let contractBalanceSAC = await EthereumService.balanceOf(process.env.SAC1_ADDRESS);
        let totalTransaction = await EthereumService.findAndCountAllTransaction({});
        const todayStartDate = new Date().setHours(0, 0, 0);
        const todayEndDate = new Date().setHours(23, 59, 59);
        let match = { createdAt: { $gte: new Date(todayStartDate), $lte: new Date(todayEndDate) } };
        let todayTotalTransaction = await EthereumService.findAndCountAllTransaction(match);
        return res.status(200).json({
            admin: admin,
            wallet: wallet,
            contractBalanceSAC: contractBalanceSAC,
            totalTransaction: totalTransaction,
            todayTotalTransaction: todayTotalTransaction
        });
    } catch (e) {
        return res.status(500).send(e.message);
    }
}

exports.changePassword = async function (req, res, next) {
    try {
        await AdminService.changePassword(req.body, req.admin);
        return res.status(200).send('Password updated successfully.');
    } catch (e) {
        return res.status(500).send(e.message);
    }
}

exports.resetPassword = async function (req, res, next) {
    try {
        await AdminService.resetPassword(req.body, req.admin);
        return res.status(200).send('Password reset successfully.');
    } catch (e) {
        return res.status(500).send(e.message);
    }
}

exports.logout = async function (req, res, next) {
    try {
        let [scheme, token] = req.headers['authorization'].toString().split(' ');
        await AdminService.logout(token);
        return res.status(200).send('Logged out successfully.');
    } catch (e) {
        return res.status(500).send(e.message);
    }
}