exports.exportUser = (user) => {
    return {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        walletAddress: user.walletAddress,
        referralCode: user.referralCode,
        phoneNumberVerified: user.phoneNumberVerification.isVerified,
        emailVerified: user.emailVerification.isVerified,
    };
}