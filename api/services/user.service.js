const utils = require('../utils');
const twinBcrypt = require('twin-bcrypt');
const md5 = require('md5');
const User = require('../models').User;
const AccessToken = require('../models').AccessToken;
const EthereumService = require('../services/ethereum.service');

exports.findById = async function (_id) {
    let user = await User.findOne({
        attributes: [
            '_id', 'name', 'email'
        ], where: { _id: _id }
    });
    return user || null;
}

exports.findByAccessToken = async function (token) {
    let accessToken = await AccessToken.findOne({ where: { _id: token } });
    if (!accessToken) throw Error('Invalid access token.');
    if (!accessToken.isActive) throw Error('Access token expired.');
    let user = await User.findOne({ where: { _id: accessToken.userId } });
    if (!user) throw Error('Invalid user.');
    return user;
}

exports.findByEmail = async function (email) {
    let user = await User.findOne({ where: { email: email } });
    return user || null;
}

exports.login = async function (obj) {
    if (!obj.email) throw Error('Eamil is required.');
    if (!obj.password) throw Error('Password is required.');
    if (!await utils.isEmail(obj.email)) throw Error('Provide valid email address.');
    let user = await module.exports.findByEmail(obj.email);
    if (!user) throw Error('Invalid credentials.');
    if (!await module.exports.verifyPassword(user, obj.password)) throw Error('Invalid credentials.');
    let accessToken = utils.getUid(92, 'alphaNumeric');
    await AccessToken.create({
        _id: accessToken,
        userId: user._id,
        isActive: true,
    });
    user = await module.exports.findById(user._id);
    let wallet = await EthereumService.getWallet(user._id);
    return [accessToken, user, wallet];
}

exports.create = async function (obj) {
    if (!obj.name) throw Error('Name is  required.');
    if (!obj.email) throw Error('Email is required.');
    if (!obj.password) throw Error('Password is required.');
    if (!await utils.isEmail(obj.email)) throw Error('Provide valid email address.');
    let _id = utils.getUid(92, 'alphaNumeric');
    let passwordHash = module.exports.createPasswordHash(obj.password);
    await User.create({
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

exports.verifyPassword = function (user, password) {
    let passwordHash = process.env.PASSWORD_SALT + md5(password);
    return twinBcrypt.compareSync(passwordHash, user.password);
}

exports.changePassword = async function (obj, user) {
    if (!obj.newPassword) throw Error('New password is required.');
    if (!obj.oldPassword) throw Error('Old password is required.');
    if (obj.oldPassword == obj.newPassword) throw Error('Old password and new password should not be same.');
    if (!module.exports.verifyPassword(user, obj.oldPassword)) throw Error('Wrong old password, please try again.');
    let passwordHash = module.exports.createPasswordHash(obj.newPassword);
    await User.update({ password: passwordHash }, {
        where: {
            _id: user._id
        }
    });
}

exports.logout = async function (token) {
    await AccessToken.update({ isActive: false }, { where: { _id: token } });
}
