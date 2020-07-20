module.exports = function (sequelize, DataTypes) {
    return sequelize.define('UserAccessToken', {
        _id: {
            type: DataTypes.STRING(256),
            allowNull: false,
            primaryKey: true
        },
        userId: {
            type: DataTypes.STRING(256),
            allowNull: false
        },
        isActive: {
            type: DataTypes.BOOLEAN(),
            allowNull: false
        }
    }, {
        tableName: 'UserAccessToken'
    });
};
