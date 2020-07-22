const utils = require("../utils");
const twinBcrypt = require("twin-bcrypt");
const md5 = require("md5");
const User = require("../models").User;
const OTPMobile = require("../models").OTPMobile;
const Referral = require("../models").Referral;
const UserAccessToken = require("../models").UserAccessToken;
const Sequelize = require("sequelize");

const client = require("twilio")(process.env.ACCOUNTSID, process.env.AUTHTOKEN);
const otpExpiryTimeMinutes = 15;
const Op = Sequelize.Op;

exports.findById = async function (_id) {
    let user = await User.findOne({
        attributes: [
            "_id",
            "name",
            "username",
            "email",
            "phoneNumber",
            "walletAddress",
            "referralCode",
            "phoneNumberVerified",
        ],
        where: { _id: _id },
    });
    return user || null;
};

exports.findByReferralCode = async function (referralCode) {
    let user = await User.findOne({
        where: { referralCode: referralCode },
    });
    return user || null;
};

exports.findByAccessToken = async function (token) {
    let userAccessToken = await UserAccessToken.findOne({
        where: { _id: token },
    });
    if (!userAccessToken) throw Error("Invalid access token.");
    if (!userAccessToken.isActive) throw Error("Access token expired.");
    let user = await User.findOne({ where: { _id: userAccessToken.userId } });
    if (!user) throw Error("Invalid user.");
    return user;
};

exports.findByEmail = async function (email) {
    let user = await User.findOne({ where: { email: email } });
    return user || null;
};

exports.findByPhoneNumber = async function (phoneNumber) {
    let user = await User.findOne({ where: { phoneNumber: phoneNumber } });
    return user || null;
};

exports.findByPhoneNumberinOTP = async function (phoneNumber) {
    let user = await OTPMobile.findOne({ where: { phoneNumber: phoneNumber } });
    return user || null;
};

exports.createPasswordHash = function (password) {
    return twinBcrypt.hashSync(process.env.PASSWORD_SALT + md5(password));
};

exports.verifyPassword = function (user, password) {
    let passwordHash = process.env.PASSWORD_SALT + md5(password);
    return twinBcrypt.compareSync(passwordHash, user.password);
};

exports.userLogin = async function (obj) {
    if (!obj.email) throw Error("Email is required.");
    if (!obj.password) throw Error("Password is required.");
    if (!(await utils.isEmail(obj.email)))
        throw Error("Provide valid email address.");
    let user = await module.exports.findByEmail(obj.email);
    if (!user) throw Error("Invalid credentials.");
    if (!(await module.exports.verifyPassword(user, obj.password)))
        throw Error("Invalid credentials.");
    let userAccessToken = utils.getUid(92, "alphaNumeric");
    await UserAccessToken.create({
        _id: userAccessToken,
        userId: user._id,
        isActive: true,
    });
    user = await module.exports.findById(user._id);
    return [userAccessToken, user];
};

exports.userCreate = async function (obj) {
    if (!obj.name) throw Error("Name is required.");
    if (!obj.username) throw Error("UserName is required.");
    if (!obj.email) throw Error("Email is required.");
    if (!obj.phoneNumber) throw Error("Phone Number is required.");
    if (!obj.password) throw Error("Password is required.");
    if (!(await utils.isEmail(obj.email)))
        throw Error("Provide valid email address.");
    let user = await module.exports.findByEmail(obj.email);
    if (user) {
        throw Error("User Exists!");
    }
    let _id = utils.getUid(92, "alphaNumeric");
    let passwordHash = module.exports.createPasswordHash(obj.password);
    let referralCode = obj.name.substring(0, 4);
    referralCode += utils.getUid(4, "alphaNumeric");
    await User.create(
        {
            _id: _id,
            name: obj.name,
            username: obj.username,
            email: obj.email,
            phoneNumber: obj.phoneNumber,
            password: passwordHash,
            referralCode: referralCode,
            phoneNumberVerified: false,
        },
        {
            fields: [
                "_id",
                "name",
                "username",
                "email",
                "phoneNumber",
                "password",
                "referralCode",
                "phoneNumberVerified",
            ],
        }
    );
    return _id;
};

exports.userChangePasswordFn = async function (newPassword, user) {
    let passwordHash = module.exports.createPasswordHash(newPassword);
    await User.update(
        { password: passwordHash },
        {
            where: {
                _id: user._id,
            },
        }
    );
};

exports.userChangePassword = async function (obj, user) {
    if (!obj.newPassword) throw Error("New password is required.");
    if (!obj.oldPassword) throw Error("Old password is required.");
    if (obj.oldPassword == obj.newPassword)
        throw Error("Old password and new password should not be same.");
    if (!module.exports.verifyPassword(user, obj.oldPassword))
        throw Error("Wrong old password, please try again.");
    await module.exports.userChangePasswordFn(obj.newPassword, user);
};

exports.addWalletAddress = async function (obj, user) {
    if (!obj.walletAddress) throw Error("Wallet Address is required.");
    await User.update(
        { walletAddress: obj.walletAddress },
        {
            where: {
                _id: user._id,
            },
        }
    );
};

exports.checkReferralCode = async function (obj, user) {
    if (!obj.referralCode) throw Error("Referral Code is required.");
    let fromuser = await module.exports.findByReferralCode(obj.referralCode);
    if (!fromuser) throw Error("Invalid Referral Code!");
    return true;
};

exports.addReferral = async function (obj) {
    if (!obj.toemail) throw Error("ToEmail is required.");
    if (!obj.referralCode) throw Error("Referral Code is required.");
    let fromuser = await module.exports.findByReferralCode(obj.referralCode);
    let touser = await module.exports.findByEmail(obj.toemail);

    try {
        let _id = utils.getUid(92, "alphaNumeric");
        let status = "Both Verification Pending!";
        let completedAt;
        if (fromuser.phoneNumberVerified == 1 && touser.phoneNumberVerified == 1) {
            status = "Verification Done.";
            completedAt = new Date();
            await Referral.create({
                _id: _id,
                from: fromuser._id,
                to: touser._id,
                referralCode: obj.referralCode,
                status: status,
                completedAt: completedAt,
            });
            return status;
        } else if (
            fromuser.phoneNumberVerified == 1 &&
            touser.phoneNumberVerified == 0
        ) {
            status = "New User Verification Pending";
        } else if (
            fromuser.phoneNumberVerified == 0 &&
            touser.phoneNumberVerified == 1
        ) {
            status = "Referred User Verification Pending";
        }

        await Referral.create({
            _id: _id,
            from: fromuser._id,
            to: touser._id,
            referralCode: obj.referralCode,
            status: status,
        });
        return status;
    } catch (error) {
        throw Error("Referral Already Exists!");
    }
};

exports.referralStatusUpdate = async function (obj) {
    if (!obj.toemail) throw Error("ToEmail is required.");
    if (!obj.referralCode) throw Error("Referral Code is required.");
    let fromuser = await module.exports.findByReferralCode(obj.referralCode);
    if (!fromuser) throw Error("Invalid Referral Code!");
    let touser = await module.exports.findByEmail(obj.toemail);
    if (!touser) throw Error("User Does not Exist!");

    try {
        let status = "Both Verification Pending!";
        let completedAt;
        if (fromuser.phoneNumberVerified == 1 && touser.phoneNumberVerified == 1) {
            status = "Verification Done.";
            completedAt = new Date();
            await Referral.update({
                status: status,
                completedAt: completedAt,
            });
            return status;
        } else if (
            fromuser.phoneNumberVerified == 1 &&
            touser.phoneNumberVerified == 0
        ) {
            status = "New User Verification Pending";
        } else if (
            fromuser.phoneNumberVerified == 0 &&
            touser.phoneNumberVerified == 1
        ) {
            status = "Referred User Verification Pending";
        }

        await Referral.update({
            status: status,
        });
        return status;
    } catch (error) {
        throw Error("Referral Status Update Failed!");
    }
};

exports.getAllReferrals = async function (obj) {
    if (!obj.referralCode) throw Error("Referral Code is required.");
    let referrals = await Referral.count({
        where: { referralCode: obj.referralCode },
    });

    if (referrals) {
        return referrals;
    } else {
        throw Error("No Referrals Found!");
    }
};

exports.userLogout = async function (token) {
    await UserAccessToken.update({ isActive: false }, { where: { _id: token } });
};

exports.sendOTP = async function (obj) {
    if (!obj.phoneNumber) throw Error("Phone Number is required.");
    let user = await module.exports.findByPhoneNumber(obj.phoneNumber);
    if (!user) throw Error("User Does not exist.");
    let _id = utils.getUid(92, "alphaNumeric");

    let otp = utils.getUid(4, "numeric");
    client.messages
        .create({
            body: "Your OTP is " + otp,
            from: "+13343263230",
            to: user.phoneNumber,
        })
        .then(async () => {
            await OTPMobile.create({
                _id: _id,
                userId: user._id,
                phoneNumber: user.phoneNumber,
                otp: otp,
            });
        })
        .catch((error) => {
            console.error(error);
        });
};

exports.verifyOTP = async function (obj) {
    if (!obj.phoneNumber) throw Error("Phone Number is required.");
    if (!obj.otp) throw Error("OTP is required.");
    let user = await module.exports.findByPhoneNumberinOTP(obj.phoneNumber);
    if (!user) throw Error("Verification Request Does not exist.");
    let usermodel = await module.exports.findByPhoneNumber(obj.phoneNumber);

    const createdAt = user.createdAt;

    // Add minutes to get time of expiry
    createdAt.setDate(createdAt.getMinutes() + otpExpiryTimeMinutes);
    const currentTime = new Date();
    // check if expiry time is greater than currentTime
    if (createdAt > currentTime) {
        if (user.otp == obj.otp) {
            await User.update(
                { phoneNumberVerified: true },
                {
                    where: {
                        _id: usermodel._id,
                    },
                }
            );
            await OTPMobile.destroy({
                where: {
                    phoneNumber: obj.phoneNumber,
                },
            });
        } else {
            throw Error("Incorrect OTP!");
        }
    } else {
        await OTPMobile.destroy({
            where: {
                phoneNumber: obj.phoneNumber,
            },
        });
        throw Error("OTP Expired!");
    }
};

exports.getAllUsers = async function (obj) {
    if (!obj.email) throw Error("Email is required.");
    //Fetching All user with walletAddress not null except the current user
    let users = await User.findAll({ where: { [Op.and]: [{ email: { [Op.not]: obj.email } }, { walletAddress: { [Op.not]: null } }]}});

    if (users) {
        return users;
    } else {
        throw Error("No Users Found!");
    }
};
