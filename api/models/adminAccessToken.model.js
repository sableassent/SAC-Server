module.exports = function (sequelize, DataTypes) {
    return sequelize.define('AdminAccessToken', {
        _id: {
            type: DataTypes.STRING(256),
            allowNull: false,
            primaryKey: true
        },
        adminId: {
            type: DataTypes.STRING(256),
            allowNull: false
        },
        isActive: {
            type: DataTypes.BOOLEAN(),
            allowNull: false
        }
    }, {
        tableName: 'AdminAccessToken'
    });
};
