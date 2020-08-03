const UserService = require('./user.service');
const utils = require('../utils');
const emailUtils = require("../utils/emailUtils")
const PasswordReset = require("../models/passwordReset.model");

const otpExpiryTimeMinutes = 15;

/**
 * Find the password reset token from PasswordReset Database using email address
 * @param email {string}
 * @returns {Promise<string>}
 */
exports.findByEmail = async function (email) {
    if (!email) throw Error("Email not present");
    if (!await utils.isEmail(email)) throw Error("Invalid email format");
    const passwordResetToken = await PasswordReset.findOne({
        userEmail: email
    });
    return passwordResetToken || null;
}

exports.deleteByEmail = async function (email) {
    if (!email) throw Error("Email not present");
    if (!await utils.isEmail(email)) throw Error("Invalid email format");
    return PasswordReset.deleteOne({userEmail: email });
}

/**
 * Set the new password given the email address and otp
 * @param obj
 * @returns {Promise<string>}
 */
exports.userNewPassword = async function (obj) {

    const { otp, email, newPassword } = obj;
    if (!otp) throw Error("OTP is required");
    if (!email) throw Error("Email id not present");
    if (!await utils.isEmail(email)) throw Error("Invalid email id");
    if (!newPassword) throw Error("newPassword not present");

    const passwordResetToken = await module.exports.findByEmail(email);

    if (!passwordResetToken) throw Error("Invalid request");

    const createdAt = passwordResetToken.createdAt;

    // Add minutes to get time of expiry
    // createdAt.setDate(createdAt.getMinutes() + otpExpiryTimeMinutes);
    const expiryDate = createdAt.getTime() + (otpExpiryTimeMinutes * 60 * 1000);
    const currentTime = new Date().getTime();

    // check if expiry time is greater than currentTime
    if (expiryDate > currentTime) {

        const { otp: sentOTP } = passwordResetToken;

        if (sentOTP === otp) {
            const user = await UserService.findByEmail(email);
            await UserService.userChangePasswordFn(newPassword, user);
            await module.exports.deleteByEmail(email);
        } else {
            throw Error("OTP does not match");
        }
    } else {
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
    const { email } = obj;
    const returnMessage = "We have sent an OTP if the user exists in our database.";
    // Create a PasswordReset entry in database
    if (!email) throw Error('Email is required.');
    if (!await utils.isEmail(email)) throw Error('Provide valid email address.');
    const user = await UserService.findByEmail(email);
    if (user == null) {
        throw Error(returnMessage);
    }

    const previousResetToken = await module.exports.findByEmail(email);
    // delete previous token if present
    if (previousResetToken) {
        await PasswordReset.deleteOne({ userEmail: email })
    }
    const otp = utils.getUid(6, 'numeric');
    const passwordResetToken = new PasswordReset({
        userEmail: user.email,
        otp: otp,
    });

    await passwordResetToken.save();

    emailUtils.sendPasswordResetMailSG(user, email, otp, function (error, response, body) {
        if (error) console.log("Error sending email: ${error}")

        console.log(`Mail Response:`, body);
    })

    return returnMessage;

    //Send mail to user (Node mailer)
}