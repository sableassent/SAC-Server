const twinBcrypt = require("twin-bcrypt");
const md5 = require("md5");

module.exports.createPasswordHash = function (password) {
    return twinBcrypt.hashSync(process.env.PASSWORD_SALT + md5(password));
};

module.exports.verifyPassword = function (user, password) {
    let passwordHash = process.env.PASSWORD_SALT + md5(password);
    return twinBcrypt.compareSync(passwordHash, user.password);
};