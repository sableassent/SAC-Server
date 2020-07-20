const UserService = require('./user.service');
const utils = require('../utils');
const emailUtils = require("../utils/emailUtils")
const PasswordReset = require('../models').PasswordReset;

const otpExpiryTimeMinutes = 15;

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

exports.deleteByEmail = async function (email) {
    if(!email) throw Error("Email not present");
    if(!await utils.isEmail(email)) throw Error("Invalid email format");
    return PasswordReset.destroy({where: {userEmail: email}});
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

    if(!passwordResetToken) throw Error("Invalid request");

    const createdAt = passwordResetToken.createdAt;

    // Add minutes to get time of expiry
    createdAt.setDate(createdAt.getMinutes() + otpExpiryTimeMinutes);
    const currentTime = new Date();

    // check if expiry time is greater than currentTime
    if(createdAt > currentTime) {

        const {otp: sentOTP} = passwordResetToken;

        if (sentOTP === otp) {
            const user = await UserService.findByEmail(email);
            await UserService.userChangePasswordFn(newPassword, user);
            await module.exports.deleteByEmail(email);
        } else {
            throw Error("OTP does not match");
        }
    }else{
        throw Error("Transaction has expired.");
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

    const previousResetToken = await module.exports.findByEmail(email);
    // delete previous token if present
    if (previousResetToken){
        await PasswordReset.destroy({where: { userEmail: email }})
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