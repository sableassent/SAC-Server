const utils = require("../utils");
const User = require("../models/user.model");
const Referral = require("../models/referral.model");
const client = require("twilio")(process.env.TWILIO_ACCOUNTSID, process.env.TWILIO_AUTHTOKEN);
const otpExpiryTimeMinutes = 15;
const passwordUtils = require("../utils/passwordUtils")
const emailUtils = require("../utils/emailUtils")
const minioClient = require("../minio");
const exportUtils = require("../utils/exportUtils")

exports.findByReferralCode = async function (referralCode) {
    let user = await User.findOne({ referralCode: referralCode });
    return user || null;
};

exports.findByAccessToken = async function (token) {
    let user = await User.findOne({ 'accessToken.token': token });
    if (!user) throw Error('Invalid access token.');
    if (!user.accessToken.isActive) throw Error('Access token expired.');
    return user;
}

exports.findByUsername = async function (username) {
    const user = await User.findOne({username: username});
    return user || null;
}

exports.findById = async function (id) {
    const user = await User.findById(id);
    return user || null;
}

exports.findByEmail = async function (email) {
    let user = await User.findOne({ email: email });
    return user || null;
};

exports.findByPhoneNumber = async function (phoneNumber) {
    let user = await User.findOne({ phoneNumber: phoneNumber });
    return user || null;
};

exports.userLogin = async function (obj) {
    if (!obj.email) throw Error("Email is required.");
    if (!obj.password) throw Error("Password is required.");
    if (!(await utils.isEmail(obj.email)))
        throw Error("Provide valid email address.");
    let user = await module.exports.findByEmail(obj.email);
    if (!user) throw Error("Invalid credentials.");
    if (!(await passwordUtils.verifyPassword(user, obj.password)))
        throw Error("Invalid credentials.");
    let userAccessToken = utils.getUid(92, "alphaNumeric");
    user.accessToken.token = userAccessToken;
    user.accessToken.isActive = true;
    user.save();
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
    let _id = utils.getUid(92, "alphaNumeric");
    let passwordHash = passwordUtils.createPasswordHash(obj.password);
    let referralCode = obj.name.substring(0, 4);
    referralCode += utils.getUid(4, "alphaNumeric");

    const user = new User({
        _id: _id,
        name: obj.name,
        username: obj.username,
        email: obj.email,
        phoneNumber: obj.phoneNumber,
        password: passwordHash,
        referralCode: referralCode,
        phoneNumberVerified: false,
    })
    await user.save();

    return _id;
};

exports.userChangePasswordFn = async function (newPassword, user) {
    // const user = User.findOne({_id: user._id});
    user.password = passwordUtils.createPasswordHash(newPassword);
    await user.save();
};

exports.userChangePassword = async function (obj, user) {
    if (!obj.newPassword) throw Error("New password is required.");
    if (!obj.oldPassword) throw Error("Old password is required.");
    if (obj.oldPassword === obj.newPassword)
        throw Error("Old password and new password should not be same.");
    if (!passwordUtils.verifyPassword(user, obj.oldPassword))
        throw Error("Wrong old password, please try again.");
    await module.exports.userChangePasswordFn(obj.newPassword, user);
};

exports.addWalletAddress = async function (obj, user) {
    const {walletAddress} = obj;
    if (!walletAddress) throw Error("Wallet Address is required.");
    user.walletAddress = walletAddress;
    await user.save();
};

exports.checkReferralCode = async function (obj, user) {
    const {referralCode} = obj;
    if (!referralCode) throw Error("Referral Code is required.");
    let fromUser = await module.exports.findByReferralCode(referralCode);
    if (!fromUser) throw Error("Invalid Referral Code!");
    return true;
};

exports.addReferral = async function (obj) {
    if (!obj.toemail) throw Error("ToEmail is required.");
    if (!obj.referralCode) throw Error("Referral Code is required.");
    const fromuser = await module.exports.findByReferralCode(obj.referralCode);
    const touser = await module.exports.findByEmail(obj.toemail);
    if(!fromuser) throw Error("Invalid referral code");
    if(!touser) throw Error("Invalid to user");

    const fromUserVerified = fromuser.phoneNumberVerification.isVerified;
    const toUserVerified   = touser.phoneNumberVerification.isVerified;

    try {
        let _id = utils.getUid(92, "alphaNumeric");
        let status = "Both Verification Pending!";
        let completedAt;
        if (fromUserVerified && toUserVerified) {
            status = "Verification Done.";
            completedAt = new Date();
            let referral = new Referral({
                _id: _id,
                from: fromuser._id,
                to: touser._id,
                referralCode: obj.referralCode,
                status: status,
                completedAt: completedAt,
            })
            await referral.save();

            return status;
        } else if (
            fromUserVerified && !toUserVerified
        ) {
            status = "New User Verification Pending";
        } else if (
            !fromUserVerified && toUserVerified
        ) {
            status = "Referred User Verification Pending";
        }

        let referral = new Referral({
            _id: _id,
            from: fromuser._id,
            to: touser._id,
            referralCode: obj.referralCode,
            status: status,
        })
        await referral.save();
        return status;
    } catch (error) {
        console.log(error);
        throw Error("Referral Already Exists!");
    }
};

exports.referralStatusUpdate = async function (obj) {
    if (!obj.toemail) throw Error("ToEmail is required.");
    let touser = await module.exports.findByEmail(obj.toemail);
    if (!touser) throw Error("User Does not Exist!");
    let referral = await Referral.findOne({ to: touser._id });
    let fromuser = await module.exports.findByReferralCode(referral.referralCode);
    if (!fromuser) throw Error("Invalid Referral Code!");

    const fromUserVerified = fromuser.phoneNumberVerification.isVerified;
    const toUserVerified   = touser.phoneNumberVerification.isVerified;

    try {
        let status = "Both Verification Pending!";
        let completedAt;
        if (fromUserVerified && toUserVerified) {
            status = "Verification Done.";
            completedAt = new Date();
            referral.status = status;
            referral.completedAt = completedAt;
            await referral.save();

            return status;
        } else if (
            fromUserVerified && !toUserVerified
        ) {
            status = "New User Verification Pending";
        } else if (
            !fromUserVerified && toUserVerified
        ) {
            status = "Referred User Verification Pending";
        }

        referral.status = status;
        await referral.save();
        return status;
    } catch (error) {
        console.log(error);
        throw Error("Referral Already Exists!");
    }
};

exports.getAllReferrals = async function (obj) {
    const {referralCode} = obj;
    if (!referralCode) throw Error("Referral Code is required.");
    let referrals = await Referral.count({
         referralCode: obj.referralCode,
    });

    if (referrals) {
        return referrals;
    } else {
        throw Error("No Referrals Found!");
    }
};

exports.userLogout = async function (token) {
    await User.updateOne({ 'accessToken.token' : token },{ 'accessToken.isActive': false });
};

exports.sendOTP = async function (obj, user) {
    let otp = utils.getUid(4, "numeric");
    client.messages
        .create({
            body: "Your OTP is " + otp,
            from: "+13343263230",
            to: user.phoneNumber,
        })
        .then(async () => {
            user.phoneNumberVerification.otp = otp;
            user.phoneNumberVerification.createdAt = new Date();
            await user.save();
        })
        .catch((error) => {
            console.error(error);
        });
};

exports.verifyOTP = async function (obj, user) {
    const {phoneNumber, otp} = obj;
    if (!phoneNumber) throw Error("Phone Number is required.");
    if (!otp) throw Error("OTP is required.");

    const createdAt = user.phoneNumberVerification.createdAt;

    // Add minutes to get time of expiry
    // createdAt.setDate(createdAt.getMinutes() + otpExpiryTimeMinutes);
    const expiryDate = createdAt.getTime() + (otpExpiryTimeMinutes * 60 * 1000);
    const currentTime = new Date().getTime();
    // check if expiry time is greater than currentTime
    if (expiryDate > currentTime) {
        if (user.phoneNumberVerification.otp === obj.otp) {
            user.phoneNumberVerification.isVerified = true;
            await user.save();
        } else {
            throw Error("Incorrect OTP!");
        }
    } else {
        throw Error("OTP Expired!");
    }
};

exports.getAllUsers = async function (obj) {
    if (!obj.email) throw Error("Email is required.");
    //Fetching All user with walletAddress not null except the current user
    let users = await User.find({ $and: [{ email: { $ne: obj.email } }, { walletAddress: { $ne: null } }]});

    if (users) {
        return users;
    } else {
        throw Error("No Users Found!");
    }
};

exports.checkUsername = async function (obj) {
    const {username} = obj;
    if(!username) throw new Error("Username is required.");
    const user = await module.exports.findByUsername(username.trim());
    return {
        userExists: user != null
    }
}

exports.contactUs = async function (obj, user) {
    const {contact_type, user_message} = obj;
    if (!contact_type) throw Error("Contact Type is required.");
    if (!user_message) throw Error("User Message is required.");
    const returnMessage = "Email Sent";


    emailUtils.sendContactUsEmailSG(user.name, obj.contact_type, user.phoneNumber, user.email, obj.user_message, function (error, response, body) {
        if (error) {
            console.log("Error sending email: ${error}")
            throw Error(error);
        }

        console.log(`Mail Response: ${body}`);
    })

    return returnMessage;
};

exports.uploadProfilePicture = async function (req, res, user) {
    const fileNameSplit = req.file.originalname.split(".");
    const extension = fileNameSplit[fileNameSplit.length-1];
    const profilePictureName = `${user._id}.${extension}`;
    minioClient.putObject("images", user._id + `.${extension}`, req.file.buffer, function(error, etag) {
        if(error) {
            return console.log(error);
        }
        // upload image path to user
        user.profilePicture = profilePictureName;
        user.save();
        res.send("Profile picture set");
    });
}

exports.getProfilePicture = async function (req, res, user) {
    const profilePicture = user.profilePicture;
    if(!profilePicture) res.status(500).send("No profile picture present");
    minioClient.getObject("images", profilePicture, function(error, stream) {
        if(error) {
            return res.status(500).send(error);
        }
        stream.pipe(res);
    });
}

exports.getUser = async function (obj, user) {
    const {id} = obj;
    if(!id) throw Error("Id cannot be empty");
    const currentUser = await module.exports.findById(id);
    return exportUtils.exportUser(currentUser);
}