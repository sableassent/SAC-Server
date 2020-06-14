const UserService = require('./../services/user.service');
const EthereumService = require('../services/ethereum.service');

exports.login = async function (req, res, next) {
    try {
        let [accessToken, user, wallet] = await UserService.login(req.body);
        return res.status(200).json({
            tokenType: 'Bearer',
            accessToken: accessToken,
            user: user,
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
        req.user = await UserService.findByAccessToken(token);
        next();
    } catch (e) {
        return res.sendStatus(401);
    }
}

exports.me = async function (req, res, next) {
    try {
        let wallet = await EthereumService.findByUserId(req.user._id);
        let contractBalanceSAC = await EthereumService.balanceOf(process.env.SAC1_ADDRESS);
        let totalTransaction = await EthereumService.findAndCountAllTransaction({});
        const todayStartDate = new Date().setHours(0, 0, 0);
        const todayEndDate = new Date().setHours(23, 59, 59);
        let match = { where: { createdAt: { $gte: new Date(todayStartDate), $lte: new Date(todayEndDate) } } };
        let todayTotalTransaction = await EthereumService.findAndCountAllTransaction(match);
        return res.status(200).json({
            user: req.user,
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
        await UserService.changePassword(req.body, req.user);
        return res.status(200).send('Password updated successfully.');
    } catch (e) {
        return res.status(500).send(e.message);
    }
}

exports.logout = async function (req, res, next) {
    try {
        let [scheme, token] = req.headers['authorization'].toString().split(' ');
        await UserService.logout(token);
        return res.status(200).send('User logout successfully.');
    } catch (e) {
        return res.status(500).send(e.message);
    }
}