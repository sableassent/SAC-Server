module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Wallet', {
        _id: {
            type: DataTypes.STRING(256),
            allowNull: false,
            primaryKey: true
        },
        userId: {
            type: DataTypes.STRING(256),
            allowNull: false
        },
        privateKey: {
            type: DataTypes.STRING(256),
            allowNull: false
        },
        balanceETH: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        balanceSAC: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        fees: {
            type: DataTypes.INTEGER.UNSIGNED.ZEROFILL,
            allowNull: true
        }
    }, {
        tableName: 'Wallet'
    });
};