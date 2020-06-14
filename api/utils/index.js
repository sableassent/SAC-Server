const validator = require('validator');

module.exports.getUid = function (length, type) {
    let uid = '';
    let chars = '';
    if (type == 'numeric') {
        chars = '0123456789';
    } else if (type == 'alphaNumeric') {
        chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    } else if (type == 'alphaNumericWithSmallLetter') {
        chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    }
    const charsLength = chars.length;
    for (let i = 0; i < length; ++i) {
        uid += chars[module.exports.getRandomInt(0, charsLength - 1)];
    }
    return uid;
};

module.exports.getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports.padByZero = function (value, finalLength) {
    while (value.length < finalLength) {
        value = "0" + value;
    }
    return value;
}

module.exports.isEmail = async function (str) {
    str = str + '';
    return validator.isEmail(str);
}