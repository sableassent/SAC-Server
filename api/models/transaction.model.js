module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Transaction', {
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
        amount: {
            type: DataTypes.STRING(256),
            allowNull: true
        },
        amountInFloat: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        fees: {
            type: DataTypes.INTEGER.UNSIGNED.ZEROFILL,
            allowNull: true
        },
        nonce: {
            type: DataTypes.INTEGER.UNSIGNED.ZEROFILL,
            allowNull: true
        },
        status: {
            type: DataTypes.STRING(256),
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'Transaction'
    });
};