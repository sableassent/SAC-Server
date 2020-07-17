const utils = require('../utils');
const twinBcrypt = require('twin-bcrypt');
const md5 = require('md5');
const Admin = require('../models').Admin;
const AdminAccessToken = require('../models').AdminAccessToken;
const EthereumService = require('../services/ethereum.service');

exports.findById = async function (_id) {
    let admin = await Admin.findOne({
        attributes: [
            '_id', 'name', 'email'
        ], where: { _id: _id }
    });
    return admin || null;
}

exports.findByAccessToken = async function (token) {
    let adminAccessToken = await AdminAccessToken.findOne({ where: { _id: token } });
    if (!adminAccessToken) throw Error('Invalid access token.');
    if (!adminAccessToken.isActive) throw Error('Access token expired.');
    let admin = await Admin.findOne({ where: { _id: adminAccessToken.adminId } });
    if (!admin) throw Error('Invalid admin.');
    return admin;
}

exports.findByEmail = async function (email) {
    let admin = await Admin.findOne({ where: { email: email } });
    return admin || null;
}

exports.login = async function (obj) {
    if (!obj.email) throw Error('Eamil is required.');
    if (!obj.password) throw Error('Password is required.');
    if (!await utils.isEmail(obj.email)) throw Error('Provide valid email address.');
    let admin = await module.exports.findByEmail(obj.email);
    if (!admin) throw Error('Invalid credentials.');
    if (!await module.exports.verifyPassword(admin, obj.password)) throw Error('Invalid credentials.');
    let adminAccessToken = utils.getUid(92, 'alphaNumeric');
    await AdminAccessToken.create({
        _id: adminAccessToken,
        adminId: admin._id,
        isActive: true,
    });
    admin = await module.exports.findById(admin._id);
    let wallet = await EthereumService.getWallet(admin._id);
    return [adminAccessToken, admin, wallet];
}

exports.create = async function (obj) {
    if (!obj.name) throw Error('Name is  required.');
    if (!obj.email) throw Error('Email is required.');
    if (!obj.password) throw Error('Password is required.');
    if (!await utils.isEmail(obj.email)) throw Error('Provide valid email address.');
    let _id = utils.getUid(92, 'alphaNumeric');
    let passwordHash = module.exports.createPasswordHash(obj.password);
    await Admin.create({
        _id: _id,
        name: obj.name,
        email: obj.email,
        password: passwordHash
    });
    return _id;
}

exports.createPasswordHash = function (password) {
    return twinBcrypt.hashSync(process.env.PASSWORD_SALT + md5(password));
}

exports.verifyPassword = function (admin, password) {
    let passwordHash = process.env.PASSWORD_SALT + md5(password);
    return twinBcrypt.compareSync(passwordHash, admin.password);
}

exports.changePassword = async function (obj, admin) {
    if (!obj.newPassword) throw Error('New password is required.');
    if (!obj.oldPassword) throw Error('Old password is required.');
    if (obj.oldPassword == obj.newPassword) throw Error('Old password and new password should not be same.');
    if (!module.exports.verifyPassword(admin, obj.oldPassword)) throw Error('Wrong old password, please try again.');
    let passwordHash = module.exports.createPasswordHash(obj.newPassword);
    await Admin.update({ password: passwordHash }, {
        where: {
            _id: admin._id
        }
    });
}

exports.logout = async function (token) {
    await AdminAccessToken.update({ isActive: false }, { where: { _id: token } });
}
