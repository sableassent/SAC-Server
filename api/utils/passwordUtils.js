const Env = require("../env");

const twinBcrypt = require("twin-bcrypt");
const md5 = require("md5");

module.exports.createPasswordHash = function (password) {
  return twinBcrypt.hashSync(Env.PASSWORD_SALT + md5(password));
};

module.exports.verifyPassword = function (user, password) {
  let passwordHash = Env.PASSWORD_SALT + md5(password);
  return twinBcrypt.compareSync(passwordHash, user.password);
};

module.exports.verifyToken = function (A) {
  return async function (req, res, next) {
    try {
      if (!req.headers["authorization"]) {
        return res.sendStatus(401);
      }
      let [scheme, token] = req.headers["authorization"].toString().split(" ");
      if (!scheme || !token) {
        return res.sendStatus(401);
      }
      if (scheme.toLowerCase() != "bearer") {
        return res.sendStatus(401);
      }
      req.user = await A.findByAccessToken(token);
      next();
    } catch (e) {
      return res.status(401).send(e.message);
    }
  };
};
