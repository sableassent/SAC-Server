const UserService = require("../services/user.service");
const EthereumService = require("../services/ethereum.service");
const PasswordResetService = require("../services/passwordReset.service");
const passwordUtils = require("../utils/passwordUtils");
const Env = require("../env");

exports.userCreate = async function (req, res, next) {
  try {
    let _id = await UserService.userCreate(req.body);
    return res.status(200).json({
      id: _id,
    });
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

exports.userLogin = async function (req, res, next) {
  try {
    let [userAccessToken, user] = await UserService.userLogin(req.body);
    return res.status(200).json({
      tokenType: "Bearer",
      userAccessToken: userAccessToken,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        walletAddress: user.walletAddress,
        referralCode: user.referralCode,
        phoneNumberVerified: user.phoneNumberVerification.isVerified,
        emailVerified: user.emailVerification.isVerified,
      },
    });
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

exports.verifyToken = passwordUtils.verifyToken(UserService);

exports.userMe = async function (req, res, next) {
  try {
    let user = await UserService.findById(req.user._id);
    let contractBalanceSAC = await EthereumService.balanceOf(Env.SAC1_ADDRESS);
    let totalTransaction = await EthereumService.findAndCountAllTransaction({});
    const todayStartDate = new Date().setHours(0, 0, 0);
    const todayEndDate = new Date().setHours(23, 59, 59);
    let match = {
      createdAt: {
        $gte: new Date(todayStartDate),
        $lte: new Date(todayEndDate),
      },
    };
    let todayTotalTransaction =
      await EthereumService.findAndCountAllTransaction(match);
    return res.status(200).json({
      user: user,
      contractBalanceSAC: contractBalanceSAC,
      totalTransaction: totalTransaction,
      todayTotalTransaction: todayTotalTransaction,
    });
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

exports.userChangePassword = async function (req, res, next) {
  try {
    await UserService.userChangePassword(req.body, req.user);
    return res.status(200).send("Password updated successfully.");
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

exports.addWalletAddress = async function (req, res, next) {
  try {
    await UserService.addWalletAddress(req.body, req.user);
    return res.status(200).send("Wallet Address updated successfully.");
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

exports.userResetPassword = async function (req, res, next) {
  try {
    const response = await PasswordResetService.userResetPassword(req.body);
    return res.status(200).send(response);
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

exports.userNewPassword = async function (req, res, next) {
  try {
    const response = await PasswordResetService.userNewPassword(req.body);
    return res.status(200).send(response);
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

exports.userLogout = async function (req, res, next) {
  try {
    let [scheme, token] = req.headers["authorization"].toString().split(" ");
    await UserService.userLogout(token);
    return res.status(200).send("Logged out successfully.");
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

exports.checkReferralCode = async function (req, res, next) {
  try {
    const response = await UserService.checkReferralCode(req.body);
    return res.status(200).send(response);
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

exports.addReferral = async function (req, res, next) {
  try {
    const response = await UserService.addReferral(req.body);
    return res.status(200).send(response);
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

exports.referralStatusUpdate = async function (req, res, next) {
  try {
    const response = await UserService.referralStatusUpdate(req.body);
    return res.status(200).send(response);
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

exports.getAllReferrals = async function (req, res, next) {
  try {
    let referrals = await UserService.getAllReferrals(req.body);
    return res.status(200).json({
      referrals: referrals,
    });
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

exports.sendOTP = async function (req, res, next) {
  try {
    await UserService.sendOTP(req.body, req.user);
    return res.status(200).send("OTP sent successfully.");
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

exports.verifyOTP = async function (req, res, next) {
  try {
    await UserService.verifyOTP(req.body, req.user);
    return res.status(200).send("OTP verified successfully.");
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

exports.getAllUsers = async function (req, res, next) {
  try {
    let users = await UserService.getAllUsers(req.body);
    return res.status(200).json({
      users: users,
    });
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

exports.checkUsername = async function (req, res, next) {
  try {
    const userExists = await UserService.checkUsername(req.body);
    return res.status(200).json(userExists);
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

exports.contactUs = async function (req, res, next) {
  try {
    let result = await UserService.contactUs(req.body, req.user);
    return res.status(200).send(result);
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

exports.uploadProfilePicture = async function (req, res, next) {
  try {
    await UserService.uploadProfilePicture(req, res, req.user);
  } catch (e) {
    return res.status(500).send(e.message);
  }
};
exports.getProfilePicture = async function (req, res, next) {
  try {
    await UserService.getProfilePicture(req, res, req.user);
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    return res.status(200).send(await UserService.getUser(req.query, req.user));
  } catch (e) {
    return res.status(500).send(e.message);
  }
};
