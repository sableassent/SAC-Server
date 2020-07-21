const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('OTPMobile', {
        _id: {
            type: DataTypes.STRING(256),
            allowNull: false,
            primaryKey: true
        },
        userId: {
            type: DataTypes.STRING(256),
            allowNull: false,
            unique: true
        },
        phoneNumber: {
            type: DataTypes.STRING(256),
            allowNull: false,
            unique: true
        },
        otp: {
            type: DataTypes.STRING(256),
            allowNull: false
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        }
    }, {
        tableName: 'OTPMobile'
    });
};