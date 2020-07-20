const UserService = require('./user.service');
const utils = require('../utils');
const emailUtils = require("../utils/emailUtils")
const PasswordReset = require('../models').PasswordReset;

/**
 * Find the password reset token from PasswordReset Database using email address
 * @param email {string}
 * @returns {Promise<string>}
 */
exports.findByEmail = async function (email) {
    if(!email) throw Error("Email not present");
    if(!await utils.isEmail(email)) throw Error("Invalid email format");
    const passwordResetToken = await PasswordReset.findOne({
        where: { userEmail: email }
    });
    return passwordResetToken || null;
}

/**
 * Set the new password given the email address and otp
 * @param obj
 * @returns {Promise<string>}
 */
exports.userNewPassword = async function (obj) {

    const {otp, email, newPassword} = obj;
    if(!otp) throw Error("OTP is required");
    if(!email) throw Error("Email id not present");
    if(!await utils.isEmail(email)) throw Error("Invalid email id");
    if(!newPassword) throw Error("newPassword not present");

    const passwordResetToken = await module.exports.findByEmail(email);

    const {otp: sentOTP} = passwordResetToken;

    if(sentOTP === otp){
        const user = await UserService.findByEmail(obj.email);
        await UserService.userChangePasswordFn(obj.newPassword, user);
    }else{
        throw Error("OTP does not match");
    }
    return "Password Reset Success";
}

/**
 * Send password reset mail with otp
 * @param obj
 * @returns {Promise<string>}
 */
exports.userResetPassword = async function (obj) {
    const {email} = obj;
    const returnMessage = "We have sent an OTP if the user exists in our database.";
    // Create a PasswordReset entry in database
    if (!email) throw Error('Email is required.');
    if (!await utils.isEmail(email)) throw Error('Provide valid email address.');
    const user = await UserService.findByEmail(email);
    if(user == null){
        throw Error(returnMessage);
    }
    const otp   = utils.getUid(6, 'numeric');


    await PasswordReset.create({
            userEmail: user.email,
            otp,
        },
        {
            fields:["userEmail" ,"otp",]
        });

    emailUtils.sendPasswordResetMail(user, email, otp).then((res) => {
        console.log("Email sent successfully", res);
    }, err => {
        console.log("Error sending mail", err);
    });

    return returnMessage;

    //Send mail to user (Node mailer)
}