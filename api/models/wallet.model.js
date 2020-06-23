module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Wallet', {
        _id: {
            type: DataTypes.STRING(256),
            allowNull: false,
            primaryKey: true
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
        fixedFees: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        percentFees: {
            type: DataTypes.DOUBLE,
            allowNull: true
        }
    }, {
        tableName: 'Wallet'
    });
};