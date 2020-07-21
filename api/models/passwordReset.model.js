const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('PasswordReset', {
        userEmail: {
            type: DataTypes.STRING(256),
            allowNull: false,
            primaryKey: true
        },
        otp: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        }
    }, {
        tableName: 'PasswordReset'
    });
};