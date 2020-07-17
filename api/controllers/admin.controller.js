const AdminService = require('../services/admin.service');
const EthereumService = require('../services/ethereum.service');

exports.login = async function (req, res, next) {
    try {
        let [adminAccessToken, admin, wallet] = await AdminService.login(req.body);
        return res.status(200).json({
            tokenType: 'Bearer',
            adminAccessToken: adminAccessToken,
            admin: admin,
            wallet: wallet
        });
    } catch (e) {
        return res.status(500).send(e.message);
    }
}

exports.verifyToken = async function (req, res, next) {
    try {
        if (!req.headers['authorization']) {
            return res.sendStatus(401);
        }
        let [scheme, token] = req.headers['authorization'].toString().split(' ');
        if (!scheme || !token) {
            return res.sendStatus(401);
        }
        if (scheme.toLowerCase() != 'bearer') {
            return res.sendStatus(401);
        }
        req.admin = await AdminService.findByAccessToken(token);
        next();
    } catch (e) {
        return res.sendStatus(401);
    }
}

exports.me = async function (req, res, next) {
    try {
        let wallet = await EthereumService.getWallet();
        let admin = await AdminService.findById(req.admin._id);
        let contractBalanceSAC = await EthereumService.balanceOf(process.env.SAC1_ADDRESS);
        let totalTransaction = await EthereumService.findAndCountAllTransaction({});
        const todayStartDate = new Date().setHours(0, 0, 0);
        const todayEndDate = new Date().setHours(23, 59, 59);
        let match = { where: { createdAt: { $gte: new Date(todayStartDate), $lte: new Date(todayEndDate) } } };
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

exports.logout = async function (req, res, next) {
    try {
        let [scheme, token] = req.headers['authorization'].toString().split(' ');
        await AdminService.logout(token);
        return res.status(200).send('Logged out successfully.');
    } catch (e) {
        return res.status(500).send(e.message);
    }
}