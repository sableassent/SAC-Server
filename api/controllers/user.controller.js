const UserService = require('../services/user.service');
const EthereumService = require('../services/ethereum.service');
const PasswordResetService = require('../services/passwordReset.service');

exports.userCreate = async function (req, res, next) {
    try {
        let _id = await UserService.userCreate(req.body);
        return res.status(200).json({
            id: _id
        });
    } catch (e) {
        return res.status(500).send(e.message);
    }
}

exports.userLogin = async function (req, res, next) {
    try {
        let [userAccessToken, user] = await UserService.userLogin(req.body);
        return res.status(200).json({
            tokenType: 'Bearer',
            userAccessToken: userAccessToken,
            user: user,
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

exports.userMe = async function (req, res, next) {
    try {
        let user = await UserService.findById(req.user._id);
        let contractBalanceSAC = await EthereumService.balanceOf(process.env.SAC1_ADDRESS);
        let totalTransaction = await EthereumService.findAndCountAllTransaction({});
        const todayStartDate = new Date().setHours(0, 0, 0);
        const todayEndDate = new Date().setHours(23, 59, 59);
        let match = { where: { createdAt: { $gte: new Date(todayStartDate), $lte: new Date(todayEndDate) } } };
        let todayTotalTransaction = await EthereumService.findAndCountAllTransaction(match);
        return res.status(200).json({
            user: user,
            contractBalanceSAC: contractBalanceSAC,
            totalTransaction: totalTransaction,
            todayTotalTransaction: todayTotalTransaction
        });
    } catch (e) {
        return res.status(500).send(e.message);
    }
}

exports.userChangePassword = async function (req, res, next) {
    try {
        await UserService.userChangePassword(req.body, req.user);
        return res.status(200).send('Password updated successfully.');
    } catch (e) {
        return res.status(500).send(e.message);
    }
}

exports.addWalletAddress = async function (req, res, next) {
    try {
        await UserService.addWalletAddress(req.body, req.user);
        return res.status(200).send('Wallet Address updated successfully.');
    } catch (e) {
        return res.status(500).send(e.message);
    }
}

exports.userResetPassword = async function (req, res, next) {
    try {
        const response = await PasswordResetService.userResetPassword(req.body);
        return res.status(200).send(response);
    } catch (e) {
        return res.status(500).send(e.message);
    }
}

exports.userNewPassword = async function (req, res, next) {
    try {
        const response = PasswordResetService.userNewPassword(req.body);
        return res.status(200).send(response);
    } catch (e) {
        return res.status(500).send(e.message);
    }
}

exports.userLogout = async function (req, res, next) {
    try {
        let [scheme, token] = req.headers['authorization'].toString().split(' ');
        await UserService.userLogout(token);
        return res.status(200).send('Logged out successfully.');
    } catch (e) {
        return res.status(500).send(e.message);
    }
}