module.exports = function (sequelize, DataTypes) {
    return sequelize.define('User', {
        _id: {
            type: DataTypes.STRING(256),
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(256),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(256),
            allowNull: false,
            unique: true,
        },
        phoneNumber: {
            type: DataTypes.STRING(256),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(256),
            allowNull: false
        },
        walletAddress: {
            type: DataTypes.STRING(256),
            allowNull: true
        },
        referralCode: {
            type: DataTypes.STRING(256),
            allowNull: false
        },
        phoneNumberVerified: {
            type: DataTypes.STRING(256),
            allowNull: false
        },
    }, {
        tableName: 'User'
    });
};