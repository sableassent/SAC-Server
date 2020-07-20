const utils = require('../utils');
const twinBcrypt = require('twin-bcrypt');
const md5 = require('md5');
const User = require('../models').User;
const UserAccessToken = require('../models').UserAccessToken;

exports.findById = async function (_id) {
    let user = await User.findOne({
        attributes: [
            '_id', 'name', 'email', 'walletAddress'
        ], where: { _id: _id }
    });
    return user || null;
}

exports.findByAccessToken = async function (token) {
    let userAccessToken = await UserAccessToken.findOne({ where: { _id: token } });
    if (!userAccessToken) throw Error('Invalid access token.');
    if (!userAccessToken.isActive) throw Error('Access token expired.');
    let user = await User.findOne({ where: { _id: userAccessToken.userId } });
    if (!user) throw Error('Invalid user.');
    return user;
}

exports.findByEmail = async function (email) {
    let user = await User.findOne({ where: { email: email } });
    return user || null;
}

exports.createPasswordHash = function (password) {
    return twinBcrypt.hashSync(process.env.PASSWORD_SALT + md5(password));
}

exports.verifyPassword = function (user, password) {
    let passwordHash = process.env.PASSWORD_SALT + md5(password);
    return twinBcrypt.compareSync(passwordHash, user.password);
}
exports.userLogin = async function (obj) {
    if (!obj.email) throw Error('Email is required.');
    if (!obj.password) throw Error('Password is required.');
    if (!await utils.isEmail(obj.email)) throw Error('Provide valid email address.');
    let user = await module.exports.findByEmail(obj.email);
    if (!user) throw Error('Invalid credentials.');
    if (!await module.exports.verifyPassword(user, obj.password)) throw Error('Invalid credentials.');
    let userAccessToken = utils.getUid(92, 'alphaNumeric');
    await UserAccessToken.create({
        _id: userAccessToken,
        userId: user._id,
        isActive: true,
    });
    user = await module.exports.findById(user._id);
    return [userAccessToken, user];
}

exports.userCreate = async function (obj) {
    if (!obj.name) throw Error('Name is required.');
    if (!obj.email) throw Error('Email is required.');
    if (!obj.phoneNumber) throw Error('Phone Number is required.');
    if (!obj.password) throw Error('Password is required.');
    if (!await utils.isEmail(obj.email)) throw Error('Provide valid email address.');
    let _id = utils.getUid(92, 'alphaNumeric');
    let passwordHash = module.exports.createPasswordHash(obj.password);
    let referralCode = utils.getUid(6, 'alphaNumeric');
    await User.create({
        _id: _id,
        name: obj.name,
        email: obj.email,
        phoneNumber: obj.phoneNumber,
        password: passwordHash,
        referralCode: referralCode
    },
        {
        fields:["_id", "name", "email", "phoneNumber", "password", "referralCode"]
    });
    return _id;
}

exports.userChangePasswordFn = async function(newPassword, user){
    let passwordHash = module.exports.createPasswordHash(newPassword);
    await User.update({ password: passwordHash }, {
        where: {
            _id: user._id
        }
    });
}

exports.userChangePassword = async function (obj, user) {
    if (!obj.newPassword) throw Error('New password is required.');
    if (!obj.oldPassword) throw Error('Old password is required.');
    if (obj.oldPassword == obj.newPassword) throw Error('Old password and new password should not be same.');
    if (!module.exports.verifyPassword(user, obj.oldPassword)) throw Error('Wrong old password, please try again.');
    await module.exports.userChangePasswordFn(obj.newPassword, user);
}

exports.addWalletAddress = async function (obj, user) {
    if (!obj.walletAddress) throw Error('Wallet Address is required.');
    await User.update({ walletAddress: obj.walletAddress }, {
        where: {
            _id: user._id
        }
    });
}

exports.userLogout = async function (token) {
    await UserAccessToken.update({ isActive: false }, { where: { _id: token } });
}
