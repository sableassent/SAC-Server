const utils = require('../utils');
const twinBcrypt = require('twin-bcrypt');
const md5 = require('md5');
const Admin = require("../models/admin.model")
const EthereumService = require('../services/ethereum.service');

// exports.findById = async function (_id) {
//     let admin = await Admin.findOne({
//         attributes: [
//             '_id', 'name', 'email'
//         ], where: { _id: _id }
//     });
//     return admin || null;
// }

exports.findByEmail = async function (email) {
    let admin = await Admin.findOne({email: email });
    return admin || null;
}

exports.findByAccessToken = async function (token) {
    let adminAccessToken = await Admin.findOne({ where: { 'accessToken.token': token } });
    if (!adminAccessToken) throw Error('Invalid access token.');
    if (!adminAccessToken.isActive) throw Error('Access token expired.');
    let admin = await Admin.findOne({ where: { _id: adminAccessToken.adminId } });
    if (!admin) throw Error('Invalid admin.');
    return admin;
}

exports.createPasswordHash = function (password) {
    return twinBcrypt.hashSync(process.env.PASSWORD_SALT + md5(password));
}

exports.verifyPassword = function (admin, password) {
    let passwordHash = process.env.PASSWORD_SALT + md5(password);
    return twinBcrypt.compareSync(passwordHash, admin.password);
}

exports.login = async function (obj) {
    if (!obj.email) throw Error('Email is required.');
    if (!obj.password) throw Error('Password is required.');
    if (!await utils.isEmail(obj.email)) throw Error('Provide valid email address.');
    let admin = await module.exports.findByEmail(obj.email);
    if (!admin) throw Error('Invalid credentials.');
    if (!await module.exports.verifyPassword(admin, obj.password)) throw Error('Invalid credentials.');
    const adminAccessToken = utils.getUid(92, 'alphaNumeric');
    admin.accessToken.token = adminAccessToken;
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
    let passwordHash = module.exports.createPasswordHash(obj.password);
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

exports.changePassword = async function (obj, admin) {
    if (!obj.newPassword) throw Error('New password is required.');
    if (!obj.oldPassword) throw Error('Old password is required.');
    if (obj.oldPassword == obj.newPassword) throw Error('Old password and new password should not be same.');
    if (!module.exports.verifyPassword(admin, obj.oldPassword)) throw Error('Wrong old password, please try again.');
    let passwordHash = module.exports.createPasswordHash(obj.newPassword);
    await Admin.updateOne({ password: passwordHash }, {
        where: {
            _id: admin._id
        }
    });
}

exports.resetPassword = async function (obj, admin) {
    //Node Mailer
}

exports.logout = async function (token) {
    await AdminAccessToken.update({ isActive: false }, { where: { _id: token } });
}
