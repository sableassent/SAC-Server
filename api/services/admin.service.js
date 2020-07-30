const utils = require('../utils');
const Admin = require("../models/admin.model")
const passwordUtils = require("../utils/passwordUtils")
const EthereumService = require("./ethereum.service");
const UserService = require("./user.service")

exports.findByEmail = async function (email) {
    let admin = await Admin.findOne({email: email });
    return admin || null;
}

exports.findByAccessToken = async function (token) {
    let user = await Admin.findOne({ 'accessToken.token': token });
    if (!user) throw Error('Invalid access token.');
    if (!user.accessToken.isActive) throw Error('Access token expired.');
    return user;
}
exports.me = async function (req, admin) {
    let wallet = await EthereumService.getWallet();
    let contractBalanceSAC = await EthereumService.balanceOf(process.env.SAC1_ADDRESS);
    let totalTransaction = await EthereumService.findAndCountAllTransaction({});
    const todayStartDate = new Date().setHours(0, 0, 0);
    const todayEndDate = new Date().setHours(23, 59, 59);
    let match = { createdAt: { $gte: new Date(todayStartDate), $lte: new Date(todayEndDate) } };
    let todayTotalTransaction = await EthereumService.findAndCountAllTransaction(match);
    return ({
        admin: admin,
        wallet: wallet,
        contractBalanceSAC: contractBalanceSAC,
        totalTransaction: totalTransaction,
        todayTotalTransaction: todayTotalTransaction
    });
}

exports.login = async function (obj) {
    if (!obj.email) throw Error('Email is required.');
    if (!obj.password) throw Error('Password is required.');
    if (!await utils.isEmail(obj.email)) throw Error('Provide valid email address.');
    let admin = await module.exports.findByEmail(obj.email);
    if (!admin) throw Error('Invalid credentials.');
    if (!await passwordUtils.verifyPassword(admin, obj.password)) throw Error('Invalid credentials.');
    const adminAccessToken = utils.getUid(92, 'alphaNumeric');
    admin.accessToken.token = adminAccessToken;
    admin.accessToken.isActive = true;
    admin.save();
    // let wallet = await EthereumService.getWallet(admin._id);
    return [adminAccessToken, admin];
}

exports.create = async function (obj) {
    if (!obj.name) throw Error('Name is  required.');
    if (!obj.email) throw Error('Email is required.');
    if (!obj.password) throw Error('Password is required.');
    if (!await utils.isEmail(obj.email)) throw Error('Provide valid email address.');
    let _id = utils.getUid(92, 'alphaNumeric');
    let passwordHash = passwordUtils.createPasswordHash(obj.password);
    const admin = new Admin({
        _id: _id,
        name: obj.name,
        email: obj.email,
        password: passwordHash
    })
    try {
        await admin.save();
        // await Admin.create(, (err, small) => {
        //     console.error(err, small);
        // });
    }catch (e) {
        throw e;
    }
    return _id;
}

// exports.changePassword = async function (obj, admin) {
//     if (!obj.newPassword) throw Error('New password is required.');
//     if (!obj.oldPassword) throw Error('Old password is required.');
//     if (obj.oldPassword === obj.newPassword) throw Error('Old password and new password should not be same.');
//     if (!module.exports.verifyPassword(admin, obj.oldPassword)) throw Error('Wrong old password, please try again.');
//     admin.password = module.exports.createPasswordHash(obj.newPassword);
//     await admin.save();
// }

exports.userLogout = async function (token) {
    await Admin.update({ 'accessToken.token' : token },{ 'accessToken.isActive': false });
};

exports.getUser = async function (obj, admin) {
    return UserService.getUser({id: obj.userId}, admin);
}