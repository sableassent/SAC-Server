const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Referral', {
        _id: {
            type: DataTypes.STRING(256),
            allowNull: false,
            primaryKey: true
        },
        from: {
            type: DataTypes.STRING(256),
            allowNull: false
        },
        to: {
            type: DataTypes.STRING(256),
            allowNull: false
        },
        referralCode: {
            type: DataTypes.STRING(256),
            allowNull: false
        },
        status: {
            type: DataTypes.STRING(256),
            allowNull: false
        },
        transactionHash: {
            type: DataTypes.STRING(256),
            allowNull: true
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        completedAt: {
            type: Sequelize.DATE,
            allowNull: true,
        },
    }, {
        tableName: 'Referral'
    });
};